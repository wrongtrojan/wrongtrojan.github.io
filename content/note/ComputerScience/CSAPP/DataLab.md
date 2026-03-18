+++
title = "DataLab"
weight= 1
date = 2026-03-14
draft = false
tags=["CSAPP"]
series=["CSAPPLab"]
series_order=1
+++
<!--more-->

## bitXor

按位异或表示成按位与/按位取反的形式  
同逻辑运算中的异或可以表示成与运算/非运算的形式类似  

二者至少有一个1且不同时为1;~(~x&~y)为德摩根律,即x|y  

## tmin

Tmin的二进制表示即为1000...0  

## isTmax

Tmax为0111..1,特点为加1后溢出为1000...0,恰好为~Tmax  
同Tmax具有相同性质的为-1,二进制表示为1111...1,加一后为0000...0需要排除  

## allOddBits

使用掩码获取需要检查的二进制位,掩码中需要的位取1,不需要的位取0  

## negate

取相反数的逻辑与负数取补码的逻辑类似  
换句话说其实负数取补码过程就是正数补码取相反数获得负数补码的过程  
这个问题说明减法可以变为加法  

## isAsciiDigit

范围问题通过做减法判断符号位来处理  
值得注意的是0边界问题:如果边界为闭,则判断正数;如果边界为开,则判断负数  

## conditional

掩码选择逻辑来代替if-else的分支  
让y和z分别在两支路径参与运算，但通过掩码让其中一支路径的结果变成0，另一条路径保持原样  

## isLessOrEqual

若符号位不同,则x的符号为1时x<y  
若符号位相同,则直接用(y-x)判断符号位(边界0为闭)  

## logicalNeg

若为负数(即符号位为1),则一定是非零数,返回0  
(判断符号位小技巧:(x>>31)+1,若为负数则为0,若为正数则为1)  
再从非负数中筛选出0,即0-1为负数,符号位为1  

## howManyBits

将负数转换成和正数相同的问题,寻找第一个出现的1  
模拟二分查找法,每次看前$n_i$位是否为0  
若不为零,则第一个零出现在前$n_i$位,需要右移i位  
若为0,则第一个零出现在后$n_i$位,不需要移动  
最后第一个1会在反复移动后的第0位找到  

## floatScale2

取出expansion部分,依据其进行分类  
若expansion为0,则为非规格化数,uf整体左移1位并保持符号位  
若expansion为255,则为无穷或NaN,返回ufjike  
若expansion为剩余值,则为规格化数,只需uf的expansion部分加1  

## floatFloat2Int

取出expansion部分,依据其进行分类  
若expansion<0,则为接近0的小数,返回0  
若expansion>31,则超出整数表示范围,返回0x80000000  
若expansion在0到31之间,先只管非符号部分做预处理  
先补充省略的1,然后当前的数已经扩展了$2^23$倍,只需左移(expansion-23)  
最后再根据符号做处理

## floatPower2

x小于-149时返回0,超出127时返回无穷大  
x小于-126时为非规格化数,根据x确定1在significand中的位置  
x大于-126时为规格化数,根据x确定1在expansion中的位置  

## 源代码

```C
//1
/* 
 * bitXor - x^y using only ~ and & 
 *   Example: bitXor(4, 5) = 1
 *   Legal ops: ~ &
 *   Max ops: 14
 *   Rating: 1
 */
int bitXor(int x, int y) {
  return ~(~x & ~y) & ~(x & y);
}
/* 
 * tmin - return minimum two's complement integer 
 *   Legal ops: ! ~ & ^ | + << >>
 *   Max ops: 4
 *   Rating: 1
 */
int tmin(void) {
  return 1<<31;

}
//2
/*
 * isTmax - returns 1 if x is the maximum, two's complement number,
 *     and 0 otherwise 
 *   Legal ops: ! ~ & ^ | +
 *   Max ops: 10
 *   Rating: 1
 */
int isTmax(int x) {
  int plusOne=x+1;
  return !(~((plusOne^x)))&!!plusOne;
}
/* 
 * allOddBits - return 1 if all odd-numbered bits in word set to 1
 *   where bits are numbered from 0 (least significant) to 31 (most significant)
 *   Examples allOddBits(0xFFFFFFFD) = 0, allOddBits(0xAAAAAAAA) = 1
 *   Legal ops: ! ~ & ^ | + << >>
 *   Max ops: 12
 *   Rating: 2
 */
int allOddBits(int x) {
  int unitMask=0xAA;
  int Mask=(unitMask<<24)+(unitMask<<16)+(unitMask<<8)+unitMask;
  return !((Mask&x)^Mask);
}
/* 
 * negate - return -x 
 *   Example: negate(1) = -1.
 *   Legal ops: ! ~ & ^ | + << >>
 *   Max ops: 5
 *   Rating: 2
 */
int negate(int x) {
  return ~x+1;
}
//3
/* 
 * isAsciiDigit - return 1 if 0x30 <= x <= 0x39 (ASCII codes for characters '0' to '9')
 *   Example: isAsciiDigit(0x35) = 1.
 *            isAsciiDigit(0x3a) = 0.
 *            isAsciiDigit(0x05) = 0.
 *   Legal ops: ! ~ & ^ | + << >>
 *   Max ops: 15
 *   Rating: 3
 */
int isAsciiDigit(int x) {
  int minushigh=0x39+(~x+1);
  //若使用x减去high,会出现当x=0x39的边界为0的情况 
  int minuslow=x+(~0x30+1);
  int Mask=1<<31;
  return !(minushigh&Mask) & !(minuslow&Mask);
}
/* 
 * conditional - same as x ? y : z 
 *   Example: conditional(2,4,5) = 4
 *   Legal ops: ! ~ & ^ | + << >>
 *   Max ops: 16
 *   Rating: 3
 */
int conditional(int x, int y, int z) {
  //x^0;  
  //如果x是0,则结果为0,则输出结果z
  //如果x不是0,则结果为非0,则输出结果y

  //((!!(x^0)-1) & z )
  //x是0 11111...1 为z
  //x非0 00000...0 为0

  //((!(x^0)-1) & y)
  //x是0 00000...0 为0
  //x非0 11111...1 为y

  // x^0等于本身
  // return ((!!x-1) & z ) | ((!x-1) & y);

  // //进一步优化
  int boolx = !!x;
  int mask= ~boolx+1;
  //或者也可以 int mask = (!!x << 31 ) >> 31
  return (mask&y) | (~mask&z);

}
/* 
 * isLessOrEqual - if x <= y  then return 1, else return 0 
 *   Example: isLessOrEqual(4,5) = 1.
 *   Legal ops: ! ~ & ^ | + << >>
 *   Max ops: 24
 *   Rating: 3
 */
int isLessOrEqual(int x, int y) {
  int xsign=x>>31;
  int ysign=y>>31;
  int signxor=xsign^ysign;
  int yminusx=y+(~x+1);
  //( (xor) & !((xor)^xsign) )
  //若均为0，1则x^y=0；若分别为0，1则x^y=111..1
  //若分别为0,1,若xsign为111...1,则x小,则为1
  //若xsign为000...0,则x大,为0
  return ( (signxor) & !((signxor)^xsign) ) | ((!signxor)&((yminusx>>31)+1));
}
//4
/* 
 * logicalNeg - implement the ! operator, using all of 
 *              the legal operators except !
 *   Examples: logicalNeg(3) = 0, logicalNeg(0) = 1
 *   Legal ops: ~ & ^ | + << >>
 *   Max ops: 12
 *   Rating: 4 
 */
int logicalNeg(int x) {
  //若x是0,返回1
  //若x是非0的数则返回0
  //当x为负数,则为0,当x为非负数,可能为1
  //还要x-1为负数
  int xsign=x>>31;
  int bias=(1<<31)>>31;
  return (xsign+1) & ((x+bias)>>31) ;

  //经典解法
  //return ((x | (~x + 1)) >> 31) + 1;
}

/* howManyBits - return the minimum number of bits required to represent x in
 *             two's complement
 *  Examples: howManyBits(12) = 5
 *            howManyBits(298) = 10
 *            howManyBits(-5) = 4
 *            howManyBits(0)  = 1
 *            howManyBits(-1) = 1
 *            howManyBits(0x80000000) = 32
 *  Legal ops: ! ~ & ^ | + << >>
 *  Max ops: 90
 *  Rating: 4
 */
int howManyBits(int x) {
  //将负数转取反,从而和正数保持一致寻找位置最高的1
  int sign=x>>31;
  x=(sign&(~x))|((~sign)&x);
  int b16,b8,b4,b2,b1,b0;
  //每次判断前n/2位是否非零，如果非零则右移相应指数表明不在前n/2位
  b16=!!(x>>16)<<4; x=x>>b16;
  b8=!!(x>>8)<<3; x=x>>b8;
  b4=!!(x>>4)<<2; x=x>>b4;
  b2=!!(x>>2)<<1; x=x>>b2;
  b1=!!(x>>1); x=x>>b1;
  b0=x&1;
  return b16+b8+b4+b2+b1+b0+1;
}
//float
/* 
 * floatScale2 - Return bit-level equivalent of expression 2*f for
 *   floating point argument f.
 *   Both the argument and result are passed as unsigned int's, but
 *   they are to be interpreted as the bit-level representation of
 *   single-precision floating point values.
 *   When argument is NaN, return argument
 *   Legal ops: Any integer/unsigned operations incl. ||, &&. also if, while
 *   Max ops: 30
 *   Rating: 4
 */
unsigned floatScale2(unsigned uf) {
  // 0 | 0000 0000 | 0000 0000 0000 0000 0000 000
  // 保持减去bias状态
  int expansion=(uf>>23)&255;

  if(!expansion) return (uf&(1<<31))|((uf<<1)&(~(1<<31)));
  if(!(expansion^255)) return uf;

  return uf+(1<<23);
}
/* 
 * floatFloat2Int - Return bit-level equivalent of expression (int) f
 *   for floating point argument f.
 *   Argument is passed as unsigned int, but
 *   it is to be interpreted as the bit-level representation of a
 *   single-precision floating point value.
 *   Anything out of range (including NaN and infinity) should return
 *   0x80000000u.
 *   Legal ops: Any integer/unsigned operations incl. ||, &&. also if, while
 *   Max ops: 30
 *   Rating: 4
 */
int floatFloat2Int(unsigned uf) {
  // 0 | 0000 000 0000 0000 0000 0000 0000 0000
  int expansion=((uf>>23)&255)-127;
  int sign=((uf>>31)&1);

  if(expansion<0) return 0;
  if(expansion>31) return 1<<31;

  int preres=((uf & 0x007FFFFF)|0x00800000);

  int res;
  if(expansion>=23){
    res=preres<<(expansion-23);
  }else{
    res=preres>>(23-expansion);
  }
  if(!sign){
    return res;
  }else{
    return -res;
  }
}
/* 
 * floatPower2 - Return bit-level equivalent of the expression 2.0^x
 *   (2.0 raised to the power x) for any 32-bit integer x.
 *
 *   The unsigned value that is returned should have the identical bit
 *   representation as the single-precision floating-point number 2.0^x.
 *   If the result is too small to be represented as a denorm, return
 *   0. If too large, return +INF.
 * 
 *   Legal ops: Any integer/unsigned operations incl. ||, &&. Also if, while 
 *   Max ops: 30 
 *   Rating: 4
 */
unsigned floatPower2(int x) {
  if(x<-149) return 0;
  if(x>127) return 0x7F800000;
  if(x<-126){
    // 0 | 0000 0000 | 1000 0000 0000 0000 0000 000
    // 22
    return 1<<(148+x);
  }else{
    return (x+127)<<23;    
  }
}

```