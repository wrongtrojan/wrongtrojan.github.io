+++
title = "CPU(RISC-V)"
weight= 3
date = 2026-04-04
draft = false
tags=["CSAPP"]
series=["CSAPPTheory"]
series_order=2
+++


## One-Cycle CPU

### Hardward

- `PC`: Program Counter
- `Memory`: Main Memory
- `Register File`: three read ports, one write port
- `ALU`: Arithmetic Logic Unit
- `Mux`: Multiplexer

### Control Signal

- `PCSrc`: Program Counter Source
- `RegWrite`: Register Write
- `MemWrite`: Memory Write
- `MemToReg`: Memory to Register
- `MemRead`: Memory Read
- `ALUSrc`: ALU Source
- `ALUOp`: ALU Operation
- `Branch`: Branch
- `Jump`: Jump

## Pipeline CPU

### Pipeline Stages

> the core idea is to made the hardware excute the instruction in parallel.

- `IF`: Instruction Fetch
- `ID`: Instruction Decode
- `EX`: Execute
- `MEM`: Memory
- `WB`: Write Back

### Hardward (New Registers)

> the core idea is to enable the specific data to follow the specific instruction.

- `IF/ID` Register 
- `ID/EX` Register 
- `EX/MEM` Register 
- `MEM/WB` Register 

### DataPath(for example)

{{< pdfviewer url="/assets/DataPath.pdf" page="1" >}}

(paddening)
