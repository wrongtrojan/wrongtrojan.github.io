---
title: "{ww} 的补集是上下文无关语言"
slug: "the-complement-of-ww-is-context-free"
date: 2026-09-08
draft: false
weight: 1
tags: ["形式语言", "上下文无关", "文法"]
series: ["理论计算机"]
series_order: 1
---

在北京大学理论计算机基础的“设计上下文无关文法”一节中, ppt 上列举了 $L=\{a,b\}^*-\{ww\mid w\in\{a,b\}^*\}$ 是上下文无关语言, 并且刘田老师表示这是一个很好的练习.

颇为难过的是, 经过几番尝试我没能构造出它对应的上下文无关文法. 我接着又将问题投掷给 AI, 它的表现也比较一言难尽, 但好在它挖出了一篇 [cs.stackexchange](https://cs.stackexchange.com/questions/19151/is-the-complement-of-ww-context-free) 上 12 年前的帖子, 正好是这个问题.

然后随即被回答中精妙的构造和证明震慑, 为了加深自己的印象, 我决定在这里记录一下完整的证明过程.

## 文法

考虑语言

$$
L=\{a,b\}^*-\{ww\mid w\in\{a,b\}^*\}.
$$

构造上下文无关文法

$$
\begin{aligned}
S&\to A\mid B\mid AB\mid BA,\\
A&\to a\mid aAa\mid aAb\mid bAa\mid bAb,\\
B&\to b\mid aBa\mid aBb\mid bBa\mid bBb.
\end{aligned}
$$

其中，$A$ 生成所有 **奇数长度且中心为 $a$** 的字符串，$B$ 生成所有 **奇数长度且中心为 $b$** 的字符串.

下面证明

$$
L=L(S).
$$

## $L\subseteq L(S)$

设

$$
x=x_1x_2\cdots x_n\in L.
$$

如果 $n$ 为奇数, 那么 $x$ 显然不可能写成 $ww$ 的形式. 此时 $x$ 可以由 $A$ 或 $B$ 生成, 从而

$$
x\in L(S).
$$

下面考虑 $n$ 为偶数的情况. 由于 $x\in L$, 所以必然存在某个

$$
1\leq i\leq \frac n2
$$

使得

$$
x_i\neq x_{i+n/2}.
$$

现在取

$$
u=x_1\cdots x_{2i-1},
$$

以及

$$
v=x_{2i}\cdots x_n.
$$

于是

$$
x=uv.
$$

其中 $u,v$ 均为奇数长度, 且其中心字符正好分别是

$$
x_i,\quad x_{i+n/2}.
$$

由

$$
x_i\neq x_{i+n/2},
$$

可知 $u,v$ 的中心字符不同, 于是

$$
x\in L(AB)\cup L(BA),
$$

从而

$$
x\in L(S).
$$

因此

$$
L\subseteq L(S).
$$

## $L(S)\subseteq L$

设

$$
x\in L(S).
$$

如果 $x$ 为奇数长度, 那么 $x$ 显然不可能写成 $ww$ 的形式. 因此

$$
x\in L.
$$

下面考虑 $x$ 为偶数长度的情况, 此时 $x$ 必然由 $S\to AB$ 或 $S\to BA$ 生成.

不失一般性, 考虑 $S\to AB$, 于是 $x$ 可以写成

$$
x=uv,
$$

其中 $u$ 由 $A$ 生成, $v$ 由 $B$ 生成. 因此 $u,v$ 均为奇数长度, 且 $u$ 的中心字符为 $a$, $v$ 的中心字符为 $b$. 设

$$
|u|=\ell,\qquad |v|=n-\ell.
$$

此时 $u,v$ 的中心字符分别为

$$
u_{(\ell+1)/2},\qquad v_{(n-\ell+1)/2}.
$$

由于 $u,v$ 的中心字符不同, 所以

$$
u_{(\ell+1)/2}\neq v_{(n-\ell+1)/2}.
$$

又因为 $x=uv$, 所以这两个字符在 $x$ 中的位置分别为

$$
\frac{\ell+1}{2},\qquad
\ell+\frac{n-\ell+1}{2}
=\frac{n+\ell+1}{2}.
$$

因此

$$
x_{(\ell+1)/2}\neq x_{(n+\ell+1)/2}.
$$

所以 $x$ 不可能写成两个完全相同的字符串拼接, 即

$$
x\in L.
$$

因此

$$
L(S)\subseteq L.
$$

综上,

$$
L=L(S).
$$

所以

$$
\{a,b\}^*-\{ww\mid w\in\{a,b\}^*\}
\text{ 是上下文无关语言.}
$$
