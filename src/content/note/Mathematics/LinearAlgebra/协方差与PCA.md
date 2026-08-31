---
title: "协方差与PCA"
date: 2026-08-28
draft: false
weight: 4
tags: ["矩阵"]
series: ["高等代数"]
series_order: 4
---

把样本排成矩阵之后，协方差是 $XX^{\top}$ 的常数倍。方差最大化和重构误差最小化都化成 Rayleigh 商，解是同一组特征向量。

## 样本矩阵与协方差

本系列统一采用“一列一个样本”的记号。设有 $N$ 个已经中心化的样本 $x_1,\ldots,x_N\in\mathbb{R}^{d}$，排成

$$
X=[x_1,\ldots,x_N]\in\mathbb{R}^{d\times N}.
$$

中心化是指 $\sum_{i=1}^{N}x_i=0$，也就是 $X\mathbf{1}=0$。未中心化时应当先减掉样本均值 $\bar x=\frac{1}{N}\sum_i x_i$，否则第一主成分会被均值向量带偏。样本协方差矩阵取无偏归一化

$$
S=\frac{1}{N-1}XX^{\top}.
$$

有的文献用 $1/N$；特征向量完全一样，特征值只差一个正常数，不影响主方向。$S$ 是 $d\times d$ 的。若把样本改成“一行一个”，数据矩阵变成 $X^{\top}$，协方差写成 $\frac{1}{N-1}X^{\top}X$，谱结论对偶，不要和这里的列样本约定混用。

## 对称半正定与谱

$S$ 具有协方差矩阵的全部代数结构。

- **对称**：$S^{\top}=S$，因此可正交对角化。
- **半正定**：对任意 $u\in\mathbb{R}^{d}$，

$$
u^{\top}Su=\frac{1}{N-1}\|X^{\top}u\|_{2}^{2}\ge 0,
$$

特征值全部非负。正定当且仅当 $X$ 行满秩（特征之间没有线性关系、样本又足够多）。
- **对角元** $S_{ii}$ 是第 $i$ 个特征的样本方差。
- **非对角元** $S_{ij}$ 是第 $i$、$j$ 个特征的样本协方差。
- 特征值从大到小标出各方向上的能量强弱；最大特征值对应方差最大的方向，接近零的特征值对应近似共线、几乎没有变化的方向。

若 $S$ 的条件数很大，某些方向方差极小，主子空间估计容易被噪声带偏。$\kappa_{2}(S)=\lambda_{\max}/\lambda_{\min}$，而 $\lambda_{i}$ 与数据矩阵奇异值的平方成比例。

## 特征分解与 $X$ 的 SVD

设数据矩阵的（紧凑）SVD 为

$$
X=U\Sigma V^{\top},
$$

则

$$
XX^{\top}=U\Sigma\Sigma^{\top}U^{\top}.
$$

因此 $S$ 的特征向量与 $X$ 的左奇异向量对齐，特征值与奇异值平方成比例：

$$
S=\frac{1}{N-1}U\Sigma\Sigma^{\top}U^{\top},\qquad
\lambda_i(S)=\frac{\sigma_i(X)^{2}}{N-1}.
$$

对 $X^{\top}X$ 做特征分解则给出右奇异向量，对应样本之间的 Gram 结构。$d$ 远小于 $N$ 时，分解 $XX^{\top}$（或 $S$）更便宜；$d$ 很大或矩阵稀疏时，直接对 $X$ 做截断 SVD 更稳、也更省。两种算法求的是同一组主方向。

## 方差最大化与 Rayleigh 商

PCA 要找一个 $r$ 维子空间，让数据在上面“最有信息”。第一种精确化是：一维投影后的样本方差尽量大。对已经中心化的 $X$，沿单位向量 $u$ 投影后的样本方差正比于

$$
\frac{1}{N-1}\sum_{i=1}^{N}(u^{\top}x_i)^{2}=\frac{1}{N-1}u^{\top}XX^{\top}u=u^{\top}Su.
$$

于是第一主成分方向是约束极值

$$
\max_{\|u\|_{2}=1}u^{\top}XX^{\top}u.
$$

Rayleigh 商把同一个问题写成无约束形式。对 $u\neq 0$ 定义

$$
R(u)=\frac{u^{\top}XX^{\top}u}{u^{\top}u}=\frac{u^{\top}Su}{u^{\top}u}.
$$

在单位球面 $\|u\|_{2}=1$ 上 $R(u)=u^{\top}XX^{\top}u$。对称矩阵的 Rayleigh 商的最大值是最大特征值，达到最大的方向是对应特征向量：

$$
\max_{u\neq 0}R(u)=\lambda_{\max}(XX^{\top}),
\qquad
u_{1}=\text{对应的单位特征向量}.
$$

用 Lagrange 乘子 $\mathcal{L}(u,\lambda)=u^{\top}XX^{\top}u-\lambda(u^{\top}u-1)$ 对 $u$ 求导，驻点方程正是

$$
XX^{\top}u=\lambda u.
$$

所以第一主方向是 $XX^{\top}$（或 $S$）的主特征向量，也是 $X$ 的第一左奇异向量。

## 序贯收缩

第 $k$ 个主成分在与已经得到的方向正交的前提下继续最大化方差：

$$
\max_{\|u\|_{2}=1,\ u\perp\mathrm{span}(u_1,\ldots,u_{k-1})}u^{\top}XX^{\top}u.
$$

Rayleigh 商在正交补上的最大值是第 $k$ 大特征值，解就是第 $k$ 个特征向量 $u_k$。这组向量自动正交，因为对称矩阵属于不同特征值的特征空间正交；有重根时可以在特征空间里再正交化。

等价的矩阵写法是**收缩（deflation）**：从 $XX^{\top}$ 里挖掉已经解释的秩一部分，

$$
A_{1}=XX^{\top},\qquad
A_{k+1}=A_{k}-\lambda_{k}u_{k}u_{k}^{\top}=XX^{\top}-\sum_{i=1}^{k}\lambda_i u_i u_i^{\top}.
$$

$A_{k+1}$ 的主特征向量就是原来的 $u_{k+1}$。在 SVD 里这相当于每次去掉一项 $\sigma_i u_i v_i^{\top}$。实际计算不必做这种减法，一次特征分解或一次截断 SVD 就给出全部 $u_1,\ldots,u_r$。收缩对应的几何是：每一步都在剩余的正交补里重复同一个 Rayleigh 问题。

前 $r$ 个主成分张成的子空间记为 $U_r=(u_1,\ldots,u_r)$，$U_r^{\top}U_r=I_r$。样本在这组基下的坐标（主成分得分）是

$$
G_r=U_r^{\top}X\in\mathbb{R}^{r\times N}.
$$

若采用“一行一个样本”的排列，同一件事会写成 $XU_r$ 或 $X^{\top}U_r$；二者只是转置约定不同，不宜强行写成一条连等式。

## 最小重构误差

第二种精确化是：用一个 $r$ 维子空间做正交投影，让重构误差尽量小。投影矩阵 $P_r=U_r U_r^{\top}$ 把每个样本送到 $\hat x_i=P_r x_i$，总平方误差是

$$
\varepsilon(U_r)=\sum_{i=1}^{N}\|x_i-\hat x_i\|_{2}^{2}=\|X-U_r U_r^{\top}X\|_{F}^{2}.
$$

优化问题为

$$
\min_{U_r^{\top}U_r=I_r}\|X-U_r U_r^{\top}X\|_{F}^{2}.
$$

$B=U_r U_r^{\top}X$ 的秩至多为 $r$。Eckart–Young–Mirsky 定理说，Frobenius 范数下秩不超过 $r$ 的最佳逼近由截断 SVD 给出，因此最优 $U_r$ 正是 $X$ 的前 $r$ 个左奇异向量。对应的最优误差是扔掉的那些奇异值的平方和：

$$
\min\varepsilon(U_r)=\sum_{i=r+1}^{\mathrm{rank}(X)}\sigma_i(X)^{2}.
$$

低秩重构可以写成

$$
\widehat{X}=U_r U_r^{\top}X=U_r\Sigma_r V_r^{\top}.
$$

方差最大化在“保留子空间”上最大化能量，重构误差最小化在“正交补”上最小化损失。Parseval 把总能量劈成两块：

$$
\|X\|_{F}^{2}=\|U_r U_r^{\top}X\|_{F}^{2}+\|(I-U_r U_r^{\top})X\|_{F}^{2},
$$

左边是常数，所以最大化第一项与最小化第二项等价，解都是前 $r$ 个左奇异向量。

实现上，$d$ 小、$N$ 大时分解 $XX^{\top}$；$d$ 大或稀疏时直接截断 SVD。中心化必须做。是否把各特征标准化成单位方差，取决于任务是否关心量纲：标准化之后 PCA 看的是相关结构，而不是原始方差结构。

## 附录：符号与常用结论

### 符号

- $A\in\mathbb{R}^{m\times n}$：一般矩阵
- $A^{\top}$：转置
- $A^{\dagger}$：Moore–Penrose 伪逆
- $\sigma_i(A)$：第 $i$ 个奇异值（降序）
- $\kappa_2(A)$：谱条件数
- $\mathrm{Col}(A)$：列空间
- $\mathrm{rank}(A)$：秩
- $\|A\|_{2}$、$\|A\|_{F}$：谱范数、Frobenius 范数
- $X\in\mathbb{R}^{d\times N}$：中心化数据矩阵（列为样本）
- $S=\frac{1}{N-1}XX^{\top}$：样本协方差
- $U_r$：前 $r$ 个左奇异向量（主成分方向）

需要求导时，把 $dX$ 收到 $\mathrm{tr}((\nabla f)^{\top}dX)$ 的末端即可读出梯度。

### 高频结论

1. $\|A\|_{2}=\sigma_1(A)$。
2. $\kappa_2(A)=\sigma_1/\sigma_r$（秩为 $r$）。
3. $A_k=\sum_{i=1}^{k}\sigma_i u_i v_i^{\top}$ 是谱范数与 Frobenius 范数下的最佳秩-$k$ 逼近。
4. $A^{\dagger}=V\Sigma^{\dagger}U^{\top}$。
5. $P=AA^{\dagger}$ 是到 $\mathrm{Col}(A)$ 的正交投影。
6. 最小二乘法方程：$A^{\top}Ax=A^{\top}b$。
7. Ridge 闭式解：$(X^{\top}X+\lambda I)w=X^{\top}y$。
8. PCA 的主方向由协方差（或 $XX^{\top}$）的主特征向量给出，与中心化数据矩阵的左奇异向量一致；差异只在特征值的常数因子和样本排列约定。
