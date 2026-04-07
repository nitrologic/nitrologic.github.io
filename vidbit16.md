# VidBit16 Display Design

### Component Video Circuit

# Hardware

## 1. Overview
The VidBit16 is a high-performance component video generator for the RP2350. It utilizes a
16-bit packed pixel architecture to drive YPbPr signals with 13-bit color/luma depth, 3-bit
genlock/alpha, and per-pixel brightness trimming.

## 2. Hardware Architecture
The system uses a passive resistor-ladder DAC combined with a PIO-driven negative rail generator.

Pinout Configuration
```
╭───────────┬─────────────────┬──────────────────────────────────────────────────────╮
│  Pin      │  Function       │  Description                                         │
├───────────┼─────────────────┼──────────────────────────────────────────────────────┤
│  **GP2**  │  Sync/Pedestal  │  Primary Luma Base (Tristate: Sync/Pedestal/Active)  │
│  **GP3**  │  Luma+          │  Fine Detail Luma (PDM)                              │
│  **GP4**  │  Pb             │  Blue-Yellow Difference (PDM)                        │
│  **GP5**  │  Pr             │  Red-Cyan Difference (PDM)                           │
│  **GP6**  │  Trim           │  Per-pixel PWM Attenuation (RC Filtered)             │
│  **GP7**  │  Neg Rail       │  Charge Pump Driver (50% Duty Cycle)                 │
╰───────────┴─────────────────┴──────────────────────────────────────────────────────╯
```
## 3. Framebuffer Layout (16-bit Packed)
Each 16-bit word is processed by five synchronized State Machines:
```
╭─────────────┬─────────────────┬──────────────────────────╮
│  Bits       │  Function       │  Resolution              │
├─────────────┼─────────────────┼──────────────────────────┤
│  **0-2**    │  Trim           │  3-bit Fine Brightness   │
│  **3-5**    │  Pr             │  3-bit Red-Cyan          │
│  **6-8**    │  Pb             │  3-bit Blue-Yellow       │
│  **9-11**   │  Y Detail       │  3-bit Grayscale Detail  │
│  **12**     │  Y Base         │  1-bit Sync/Pedestal     │
│  **13-15**  │  Genlock/Alpha  │  3-bit Metadata          │
╰─────────────┴─────────────────┴──────────────────────────╯
```
## 4. Bill of Materials (BOM)
* MCU: RP2350 (Pico 2)
* Charge Pump (GP7): 2x BAT54S Diodes, 2x 1µF Ceramic Capacitors.
* DAC/Filter (per Y, Pb, Pr): 3x 240Ω resistors, 3x 330Ω resistors, 3x 470pF capacitors.
* Trim Filter (GP6): 1x 1kΩ resistor, 1x 10µF capacitor, 3x 10kΩ coupling resistors.
* Connectors: 3x RCA Female Jacks.

## 5. Design Principles
* Passive DAC: Uses voltage division against the TV’s 75Ω load to achieve standard YPbPr levels.
* PDM Modulation: 10-cycle pixel loops generate high-frequency pulse density patterns, smoothed by RC filters to achieve analog-like color depth.
* Per-Pixel Trim: The GP6 PWM channel modulates the bias of the entire DAC network on a per-pixel basis, allowing for dynamic brightness and contrast adjustment.
* Synchronization: SM0 acts as the master clock, feeding the fifos trigger activity of the PDM/Trim state machines, ensuring perfect alignment between sync, pedestal, and color data.

## 6. PIO Architecture & Data Pipeline

To maintain a strict 16-bit per pixel memory bandwidth without utilizing the CPU, the architecture employs a multi-stage State Machine (SM) pipeline linked by DMA channels.

### 6.1 The Multi-SM Pipeline

1.  Broadcast DMA: A single DMA channel reads the 16-bit packed framebuffer and broadcasts it to the TX FIFOs of the dedicated "Expander" State Machines.
2.  Expander SMs (Bit-to-PDM): Each Expander SM strips its specific 3-bit payload, executes a computed jump to generate a symmetric 10-bit PDM pattern, and pushes it to its RX FIFO.
3.  Bridge DMAs: Dedicated memory-to-memory DMA channels move the generated 10-bit patterns from the Expander RX FIFOs to the Output SM TX FIFOs.
4.  Output SMs: Synchronized "dumb" shifters that clock the 10-bit patterns to the physical pins at the 148.5 MHz system clock.

### 6.2 Expander State Machine (PIO)

This program converts a 3-bit color/luma index into a 10-cycle, high-frequency symmetric PDM pattern. It fits within 28 instructions.

    .program expand28
            jmp     b0
            jmp     b1
            jmp     b2
            jmp     b3
            jmp     b4
            jmp     b5
            jmp     b6
            jmp     b7
    emit:
            in      x, 5
            in      x, 4
    public fetch:
            out     pc, 3
    b0:     set     x, 0b00000
            jmp     emit
    b1:     set     x, 0b10000
            jmp     emit
    b2:     set     x, 0b00100
            jmp     emit
    b3:     set     x, 0b10100
            jmp     emit
    b4:     set     x, 0b00101
            jmp     emit
    b5:     set     x, 0b11010
            jmp     emit
    b6:     set     x, 0b01011
            jmp     emit
    b7:     set     x, 0b11110
            jmp     emit

### 6.3 Output State Machine (PIO)

This program runs on the physical output pins (Luma+, Pb, Pr, Trim). 

It is synchronized to the `vidblit` base Luma FIFO to maintain perfect alignment with horizontal and vertical blanking.

    .program pwm10
            out     pins, 1
            out     pins, 1
            out     pins, 1
            out     pins, 1
            out     pins, 1
            out     pins, 1
            out     pins, 1
            out     pins, 1
            out     pins, 1
            set     pins, 0
    .wrap

To transition this hardware architecture into C++, we need to orchestrate the RP2350's hardware blocks to run autonomously. 

The CPU's only job during active video should be filling the framebuffer for the next frame.

Here are the primary software components we need to configure:

## 1. System & Pin Initialization

* Clocking: Lock the system clock to exactly 148.5 MHz so the PIO dividers can simply be `1.0`.
* GPIO Muxing: Assign GP2-GP5 to PIO0. Assign GP7 (Negative Rail) to the hardware PWM block.
* PWM Config: Set GP7 to a continuous 50% duty cycle at a high frequency (e.g., 14.85 MHz) to drive the charge pump.

## 2. PIO Configuration

We need to load three distinct PIO programs into the instruction memory and configure the State Machines (SMs):
* SM0 (Y Base): Load `vidblit.pio`.
* SM1-SM3 (Expanders): Load `expand.pio`. Configure `OUT` shift (right) and `IN` shift (left). Set `autopush` threshold to 9. Set the `out null, N` shift masks to strip the correct bits for Y Detail, Pb, and Pr.
* SM4-SM6 (Outputs): Load `pwm10.pio`. Map both `OUT` and `SET` to the respective GPIO pins. Set `autopull` threshold to 9.

## 3. The DMA Routing Topology

This is the most complex C++ task. We need two layers of DMA:

* Layer 1 (The Broadcast): Dedicated DMA channels reading from the 16-bit framebuffer and writing to the TX FIFOs of the Expander SMs.
* Layer 2 (The Bridge): Dedicated memory-to-memory DMA channels reading from the Expander RX FIFOs and writing to the `pwm10` TX FIFOs, paced by the Output SM's `DREQ`.

## 4. Scanline Dispatch (The Trigger)

Because `vidblit` handles the horizontal blanking internally, the DMA channels feeding the pixel data must be carefully triggered so they only send data during the active video window.

