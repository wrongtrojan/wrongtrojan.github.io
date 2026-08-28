---
title: "指令集(RISC-V)"
date: 2026-03-23
draft: false
weight: 2
tags: ["CSAPP"]
series: ["CSAPPTheory"]
series_order: 1
---

RISC-V 常用操作是固定宽度的 32 位指令。操作码决定格式，寄存器编号占 5 位（`x0`–`x31`），立即数按格式拆进不同字段。

## 指令分类

### 算术

| 指令 | 格式 | 含义 |
|---|---|---|
|`add rd, rs1, rs2`|R|`rd = rs1 + rs2`|
|`sub rd, rs1, rs2`|R|`rd = rs1 - rs2`|
|`addi rd, rs1, imm`|I|`rd = rs1 + imm`|
|`lui rd, imm`|U|把 20 位立即数装入 `rd` 的高 20 位，低 12 位清零|

`addi` 的立即数是 12 位有符号数。要构造更大的常数，先用 `lui` 写高位，再用 `addi` 补低 12 位。

### 逻辑

| 指令 | 格式 | 含义 |
|---|---|---|
|`and rd, rs1, rs2`|R|`rd = rs1 & rs2`|
|`or rd, rs1, rs2`|R|`rd = rs1 \| rs2`|
|`xor rd, rs1, rs2`|R|`rd = rs1 ^ rs2`|
|`andi` / `ori` / `xori`|I|`rd = rs1` 与立即数做对应按位运算|

### 移位

| 指令 | 格式 | 含义 |
|---|---|---|
|`sll rd, rs1, rs2`|R|`rd = rs1 << rs2`（逻辑左移，空位补 0）|
|`srl rd, rs1, rs2`|R|`rd = rs1 >> rs2`（逻辑右移，空位补 0）|
|`sra rd, rs1, rs2`|R|`rd = rs1 >> rs2`（算术右移，空位补符号位）|
|`slli` / `srli` / `srai`|I|移位量取自立即数，规则与上面对应|

移位量实际只用 `rs2` 或立即数的低几位（RV32 用低 5 位）。`sll` 与 `srl` 不保留符号；要保留符号只能用 `sra` / `srai`。

### 比较

| 指令 | 格式 | 含义 |
|---|---|---|
|`slt rd, rs1, rs2`|R|有符号比较：若 `rs1 < rs2` 则 `rd = 1`，否则 `rd = 0`|
|`sltu rd, rs1, rs2`|R|无符号比较，规则同上|
|`slti` / `sltiu`|I|右操作数换成立即数|

比较指令只写 0 或 1，本身不改变控制流。分支指令另有一套。

### 加载与存储

| 指令 | 格式 | 含义 |
|---|---|---|
|`lw rd, imm(rs1)`|I|`rd = Memory[rs1 + imm]`，读一个字|
|`lb` / `lbu`|I|读一个字节；`lb` 符号扩展，`lbu` 零扩展|
|`lh` / `lhu`|I|读半字（16 位）；`lh` 符号扩展，`lhu` 零扩展|
|`sw rs2, imm(rs1)`|S|`Memory[rs1 + imm] = rs2`，写一个字|
|`sb` / `sh`|S|写一个字节 / 半字|

有效地址一律是 `rs1 + 符号扩展后的立即数`。加载写 `rd`，存储读 `rs2`。字节、半字写入内存时只动对应宽度，不自动清掉字里的其余位。

### 分支与跳转

| 指令 | 格式 | 含义 |
|---|---|---|
|`beq` / `bne rs1, rs2, Label`|B|若 `rs1 == rs2` / `rs1 != rs2` 则转到 `Label`|
|`blt` / `bge rs1, rs2, Label`|B|有符号：小于 / 大于等于则转|
|`bltu` / `bgeu rs1, rs2, Label`|B|无符号：小于 / 大于等于则转|
|`jal rd, Label`|J|`rd = PC + 4`，然后转到 `Label`|
|`jalr rd, imm(rs1)`|I|`rd = PC + 4`，然后转到 `rs1 + imm`（通常再把最低位清掉以对齐）|

条件分支的立即数是相对当前 PC 的偏移，编码时最低位恒为 0（半字对齐）。`jal` 把返回地址写入 `rd`（习惯用 `x1`/`ra`）；`jalr` 用来从函数返回（`jalr x0, 0(ra)`）或做间接跳转。

## 指令格式

六种格式都是 32 位，最低 7 位是 `opcode`。R 型三个寄存器；I 型把 12 位立即数放在高位；S 型与 B 型把立即数拆开，好把 `rs1`、`rs2` 对齐到与 R 型相同的位置；U 型与 J 型给立即数 20 位。

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
      <div class="bit-field bf-imm w-7">imm[12\|10:5]<span class="bit-size">7</span></div>
      <div class="bit-field bf-rs w-5">rs2<span class="bit-size">5</span></div>
      <div class="bit-field bf-rs w-5">rs1<span class="bit-size">5</span></div>
      <div class="bit-field bf-funct w-3">f3<span class="bit-size">3</span></div>
      <div class="bit-field bf-imm w-5">imm[4:1\|11]<span class="bit-size">5</span></div>
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
      <div class="bit-field bf-imm w-20">imm[20\|10:1\|11\|19:12]<span class="bit-size">20</span></div>
      <div class="bit-field bf-rd w-5">rd<span class="bit-size">5</span></div>
      <div class="bit-field bf-opcode w-7">opcode<span class="bit-size">7</span></div>
    </div>
  </div>
</div>

B 型与 J 型把立即数的位打乱，是为了让符号位始终落在指令的最高位，硬件符号扩展更简单。下一篇用这些字段去驱动单周期和流水线数据通路。
