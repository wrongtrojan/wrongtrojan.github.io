+++
title = "Instruction Set(RISC-V)"
weight= 2
date = 2026-03-23
draft = false
tags=["CSAPP"]
series=["CSAPPTheory"]
series_order=1
+++

## Instruction Category

### Arithmetic

| instruction | type | implication |
|---|---|---|
|`add rd, rs1, rs2`|R|rd=rs1+rs2|
|`sub rd, rs1, rs2`|R|rd=rs1-rs2|
|`addi rd, rs1, imm`|I|rd=rs1+imm|
|`lui rd, imm`|U|Load Upper Immediate(20 bit)|

### Logical

| instruction | type | implication |
|---|---|---|
|`and rd, rs1, rs2`|R|rd=rs1&rs2|
|`or rd, rs1, rs2`|R|rd=rs1\|rs2|
|`xor rd, rs1, rs2`|R|rd=rs1^rs2|
|`addi/ori/xori`|I|rd=rs1 op imm|

### Shift

| instruction | type | implication |
|---|---|---|
|`sll rd, rs1, rs2`|R|rd=rs1<<rs2|
|`srl rd, rs1, rs2`|R|rd=rs1>>rs1(logical)|
|`sra rd, rs1, rs2`|R|rd=rs1>>rs2(arithetic)|
|`slli/srli/srai`|I|rd=rs1 shift imm|

### Comparison

| instruction | type | implication |
|---|---|---|
|`slt rd, rs1, rs2`|R|`if(rs1<rs2) rd=1 else rd=0`(signed)|
|`sltu rd, rs1, rs2`|R|`if(rs1<rs2) rd=1 else rd=0`(unsigned)|
|`slti/sltiu`|I|`if (rs1 < imm) rd=1 else rd=0`|

### Load & Store

| instruction | type | implication |
|---|---|---|
|`lw rd, imm(rs1)`|I|rd=Memory[rs1+imm]|
|`lb/lbu`|I|Load a bit|
|`lh/lhu`|I|Load half a word|
|`sw rs2, imm(rs1)`|S|Memory[rs1+imm]=rs2|
|`sb/sh`|S|Store a bit/half a word|

### Brach & Jump

| instruction | type | implication |
|---|---|---|
|`beq/ben rs1, rs2 Label`|B|`if(rs1== / !=rs2) goto Label`|
|`blt/bge rs1, rs2 Label`|B|`if(rs1< / >=rs2) goto Label`(signed)|
|`bltu/bgeu rs1, rs2 Label`|B|`if(rs1< / >=rs2) goto Label`(unsigned)|
|`jal rd, Label`|J|`rd=PC+4; goto Label`|
|`jalr rd, imm(rs1)`|I|`rd=PC+4; goto (rsi+imm)`|

## Instruction Type

<div class="riscv-container">
  <div class="riscv-row">
    <div class="riscv-type-label">(R)egister</div>
    <div class="riscv-bits-group">
      <div class="bit-field bf-funct w-7">funct7<span class="bit-size">7</span></div>
      <div class="bit-field bf-rs w-5">rs2<span class="bit-size">5</span></div>
      <div class="bit-field bf-rs w-5">rs1<span class="bit-size">5</span></div>
      <div class="bit-field bf-funct w-3">f3<span class="bit-size">3</span></div>
      <div class="bit-field bf-rd w-5">rd<span class="bit-size">5</span></div>
      <div class="bit-field bf-opcode w-7">opcode<span class="bit-size">7</span></div>
    </div>
  </div>

  <div class="riscv-row">
    <div class="riscv-type-label">(I)mmediate</div>
    <div class="riscv-bits-group">
      <div class="bit-field bf-imm w-12">imm[11:0]<span class="bit-size">12</span></div>
      <div class="bit-field bf-rs w-5">rs1<span class="bit-size">5</span></div>
      <div class="bit-field bf-funct w-3">f3<span class="bit-size">3</span></div>
      <div class="bit-field bf-rd w-5">rd<span class="bit-size">5</span></div>
      <div class="bit-field bf-opcode w-7">opcode<span class="bit-size">7</span></div>
    </div>
  </div>

  <div class="riscv-row">
    <div class="riscv-type-label">(S)tore</div>
    <div class="riscv-bits-group">
      <div class="bit-field bf-imm w-7">imm[11:5]<span class="bit-size">7</span></div>
      <div class="bit-field bf-rs w-5">rs2<span class="bit-size">5</span></div>
      <div class="bit-field bf-rs w-5">rs1<span class="bit-size">5</span></div>
      <div class="bit-field bf-funct w-3">f3<span class="bit-size">3</span></div>
      <div class="bit-field bf-imm w-5">imm[4:0]<span class="bit-size">5</span></div>
      <div class="bit-field bf-opcode w-7">opcode<span class="bit-size">7</span></div>
    </div>
  </div>

  <div class="riscv-row">
    <div class="riscv-type-label">(B)ranch</div>
    <div class="riscv-bits-group">
      <div class="bit-field bf-imm w-7">imm[12|10:5]<span class="bit-size">7</span></div>
      <div class="bit-field bf-rs w-5">rs2<span class="bit-size">5</span></div>
      <div class="bit-field bf-rs w-5">rs1<span class="bit-size">5</span></div>
      <div class="bit-field bf-funct w-3">f3<span class="bit-size">3</span></div>
      <div class="bit-field bf-imm w-5">imm[4:1|11]<span class="bit-size">5</span></div>
      <div class="bit-field bf-opcode w-7">opcode<span class="bit-size">7</span></div>
    </div>
  </div>

  <div class="riscv-row">
    <div class="riscv-type-label">(U)pper</div>
    <div class="riscv-bits-group">
      <div class="bit-field bf-imm w-20">imm[31:12]<span class="bit-size">20</span></div>
      <div class="bit-field bf-rd w-5">rd<span class="bit-size">5</span></div>
      <div class="bit-field bf-opcode w-7">opcode<span class="bit-size">7</span></div>
    </div>
  </div>

  <div class="riscv-row">
    <div class="riscv-type-label">(J)ump</div>
    <div class="riscv-bits-group">
      <div class="bit-field bf-imm w-20">imm[20|10:1|11|19:12]<span class="bit-size">20</span></div>
      <div class="bit-field bf-rd w-5">rd<span class="bit-size">5</span></div>
      <div class="bit-field bf-opcode w-7">opcode<span class="bit-size">7</span></div>
    </div>
  </div>
</div>
