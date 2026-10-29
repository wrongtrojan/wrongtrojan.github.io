---
title: "多维随机变量"
slug: "multivariate-random-variables"
date: 2026-10-29
draft: false
weight: 3
tags: ["概率", "随机向量", "正态分布"]
series: ["概率论"]
series_order: 3
---

> 这一章首先介绍刻画多维随机变量的三种分布 (以二维随机变量为例)， 即联合分布，边缘分布与条件分布， 然后讨论随机变量的独立性, 最后展示两种典型的多维随机变量, 尤其重点讨论 $MVN$. 

## Joint Distribution

$X,Y$ 的联合分布可以提供多维随机变量(随机向量) $(X,Y)$ 的全部信息, 包括 $X,Y$ 各自的信息与 $X,Y$ 之间的关联. 

随机向量的联合分布的几种表达方式由随机变量推广而来:
1. 随机向量 $X,Y$ 的联合 $CDF$ 被定义为 $F_{X,Y}(x,y)=P(X\leq x,Y\leq y)$ 
2. 离散型随机向量的联合 $PMF$ 被定义为 $p_{X,Y}(x,y)=P(X=x,Y=y)$
3. 随机向量的联合 $PDF$ 被定义为 $f_{X,Y}=\frac{\partial^2}{\partial x\partial y}F_{X,Y}(x,y)$

随机向量的联合 $PDF$ 的几何含义:

$f_{X,Y}(x,y)$ 本身不能作为概率直接理解, 但是与微分 $dx,dy$ 相乘后, 即曲面在极小区域下的体积, 可以被视为 $(X,Y)$ 落入在 $(x,y)$ 邻域的概率. 

延续该理解, 我们可以将概率求解 (如 $P(X<Y)$), 转换为 $(X,Y)$ 落在平面上特定区域 (如 $x<y$) 的概率问题, 进而转换成基于 $f_{X,Y}$ 的积分问题 ($\int^{\infty}_{-\infty}\int^y_{-\infty}f_{X,Y}(x,y)\,dx\, dy$)

---

## Marginal Distribution

边缘分布则只关注其中一个分量 $X$ 或 $Y$.  以 $(X,Y)$ 中 $X$ 的边缘分布为例理解边缘分布, 考虑 $X=x$ , 此时 $Y$ 有多种取值, 我们不关心 $Y$ 的具体取值, 将这些取值情况统计在一起, 此时我们关心的 $X$ 的分布就是随机向量的边缘分布. 

随机向量的边缘分布一般由联合分布得 (以 $X$ 为例) :
1. 随机向量 $X,Y$ 的边缘 $CDF$ 为 $F_X(x)=P(X\leq x)=\lim_{y\to\infty}P(X\leq x,Y\leq y)=\lim_{y\to\infty}F_{X,Y}(x,y)$
2. 随机向量 $X,Y$ 的边缘 $PMF$ 为 $P(X=x)=\sum_{y}P(X=x,Y=y)$
3. 随机向量 $X,Y$ 的边缘 $PDF$ 为 $f_X(x)=\int^{\infty}_{-\infty}f_{X,Y}(x,y)\,dy$

可以从几何意义理解边缘分布为, 将多维随机变量的联合分布沿着垂直于不关心的分量的方向投影

---

## Conditional Distribution

条件分布同样只关注一个分量 $X,Y$, 但与边缘分布不同之处在于, 我们对于 $X$ 的关注建立在已知分量 $Y=y$ 的前提条件.

随机向量的条件分布的刻画依赖于条件概率的定义 :
1. 随机向量 $X,Y$ 的条件 $PMF$ 为 $P(X=x|Y=y)=\frac{P(X=x,Y=y)}{P(Y=y)}$
2. 随机向量 $X,Y$ 的条件 $PDF$ 为 $f_{X|Y}(x|y)=\frac{f_{X,Y}(x,y)}{f_Y(y)}$

通过 $Bayes$ 法则, 可以建立起联合分布, 边缘分布和条件分布之间的关联 (以连续型为例) : $f_{X,Y}(x,y)=f_{Y|X}(y|x)f_X(x)=f_{X|Y}(x|y)f_Y(y)$

从几何意义理解条件分布, 以 $f_{X|Y}(x|y)$ 为例, 将条件分布的获得分为两个步骤, 首先用 $Y=y$ 平面截取曲面 $f_{X,Y}$, 得到一条曲线, 然后从积分的角度这条曲线做归一化, 即除以边缘分布 $f_Y(y)$. 

---

## Independence

随机变量之间的独立性最朴素的定义来自于事件的独立性, 如果对于 $\forall x,y$, 事件 $\{X\leq x\}$ 与事件 $\{Y\leq y\}$ 相互独立, 则两个随机变量独立. 换句话说, 如果已知 $Y$ 的任何信息, 都不会给 $X$ 带来新的影响, 则 $X,Y$ 独立.

形式化的判定方法:
1. 若对所有 $x,y$ 有 $F_{X,Y}(x,y)=F_X(x)F_Y(y)$, 则 $X,Y$ 相互独立
2. 对于离散型随机变量, 上式等价于 $P(X=x,Y=y)=P(X=x)P(Y=y)$ 或 $P(X=x|Y=y)=P(X=x)$
3. 对于连续型随机变量, 上式等价于 $f_{X,Y}(x,y)=f_X(x)f_Y(y)$ 或 $f_{X|Y}(x|y)=f_X(x)$

上述判定方法朴素的做法是对所有 $x,y$ 进行判定, 这在实际判断中并不现实, 更为实际的一种做法是判断 $F_{X,Y}$ 或 $f_{X,Y}$ 中的 $x,y$  变量是否可以完全分离为 $g(x)*f(y)$.

---
## Typical Multivariate RVs

**注**: 以下所有向量均采取列向量形式记号, 即 $(X_1,...X_n)$ 实际表达

$$
\begin{pmatrix}
X_1 \\
\vdots \\
X_n
\end{pmatrix}
$$
### Multinomial

考虑这样的场景 : $n$ 个物品独立地放入 $k$ 类中的其中一类, 其中每个物品有 $p_j$ 的概率放在第 $j$ 类 ($\sum p_j=1$). $X_i$ 是刻画第 $i$ 类物品个数的随机变量, 则随机向量 $X=(X_1,X_2,...,X_k)$ 服从以 $n$ 和概率向量 $p=(p_1,p_2,...p_k)$ 的 $Multinomial$ 分布, 记为 $X\sim Mult_k(n,p)$.

对于 $X\sim Mult_k(n,p)$, 

1. $Multinomial$ 的联合分布容易求出为 (采取顺序消去计算方式数) : 

$$
P(X_1=n_1,...,X_k=n_k)=\frac{n!}{n_1!n_2!...n_k!}\cdot p_1^{n_1}p_2^{n_2}...p_k^{n_k}
$$

2. $Multinomial$ 的边缘分布为二项分布, $X_j\sim Bin(n,p_j)$, 显然, 当我们只关注第 $j$ 类的个数时, $n$ 个物品以 $p_j$ 的概率放入第 $j$ 类, 或以 $1-p_j$ 的概率不放入.
3. $Multinomial$ 具有合并性质, 即 $(X_1+X_2,X_3,...,X_k)\sim Mult_{k-1}(n,(p_1+p_2,p_3,...p_k))$, 将第 $1$ 类与第 $2$ 类合并, 则落入 $1,2$ 类的概率为 $p_1+p_2$, 则问题变为 $n$ 个物品独立放在 $k-1$ 类中.
4. $Multinomial$ 的条件分布依旧为 $Multinomial$, $(X_2,...,X_k)|X_1=n_1 \sim Mult_{k-1}(n-n_1,(p_2^{'},...,p_k^{'}))$, 其中 $p_j^{'}=p_j/(p_2+...+p_k)$. 如果已经知道 $X_1=n_1$, 则问题更新为, 将 $n-n_1$ 个物品放在 $k-1$ 类中, 其中放入每个类的概率随之更新.

显然, 由于 $\sum_{i=1}^{k} X_i=n$, $X_i$ 与 $X_j$ 之间存在依赖关系, 使用 [Covariance](/note/mathematics/probability/mathematical-properties-of-rvs/#covariance) (具体在 [Mathematical Properties of RVs](/note/mathematics/probability/mathematical-properties-of-rvs/) 的 [Covariance](/note/mathematics/probability/mathematical-properties-of-rvs/#covariance) 节中介绍) 刻画两者的线性关系 :

$$
\begin{aligned}
& Var(X_i+X_j)=Var(X_i)+Var(X_j)+2Cov(X_i,X_j) \\
\Rightarrow & \,n(p_i+p_j)(1-p_i-p_j)=np_i(1-p_i)+np_j(1-p_j)+2Cov(X_i,X_j) \\
\Rightarrow & \,Cov(X_i,X_j)=-np_ip_j
\end{aligned}
$$
$Cov$ 为负说明 $X_i,X_j$ 具有一定的负相关关系, 这是符合直觉的, 如果大量的物品都放入第 $i$ 类, 则可能导致没有更多的物品放入第 $j$ 类.

### Multivariate Normal

$Multivariate$ $Normal$ 分布, 简写为 $MVN$, 是 $Normal$ 分布在更高维度的扩展, 是非常重要的一种分布.

对于 $k$ 维随机向量 $X=(X_1,...,X_k)$ , 每个分量都是 $Normal$ 分布并不足以说明随机向量服从 $MVN$ 分布, 需要更强的结论, 即任意线性组合 $A^TX$ ($A=(t_1,...,t_k)$) 服从 $Normal$ 分布, 此时则称 $X$ 服从 $MVN$ 分布.

从 $MVN$ 的定义可以很快得知 $MVN$ 的边缘分布是 $Normal$ 分布, 只需取 $A=e_i$ 即可. 同理服从 $MVN$ 的随机向量, 其子向量也服从 $MVN$ 分布, 只需取 $A=\sum e_i$. 

下面以 $BVN$ (二维正态分布)为例, 更为深入地介绍 $MVN$ 的一些性质. (这个部分需要对 [Covariance](/note/mathematics/probability/mathematical-properties-of-rvs/#covariance) 有一定程度了解)

#### Independence

首先对于 $BVN$ 有$Cov=0 \iff$ $X_1$ 与 $X_2$ 独立 (在 [Covariance](/note/mathematics/probability/mathematical-properties-of-rvs/#covariance) 中会介绍, 在一般分布下, 独立性是比协方差为零更强的结论). 具体证明可以使用 [MGF](/note/mathematics/probability/mathematical-properties-of-rvs/#mgf) (同样在 [Mathematical Properties of RVs](/note/mathematics/probability/mathematical-properties-of-rvs/) 中介绍) :

$$
E(e^{t_1X_1+t_2X_2})=\exp(t_1E(X_1)+t_2E(X_2)+\frac{1}{2}Var(t_1X_1+t_2X_2))
$$
当 $Cov(X_1,X_2)=0$ 时, $Var(t_1X_1+t_2X_2)=Var(t_1X_1)+Var(t_2X_2)$, 此时有 

$$
E(e^{t_1X_1+t_2X_2})=E(e^{t_1X_1})E(e^{t_2X_2})
$$

由矩母函数唯一性定理可知 $X_1,X_2$ 独立

由此可以推出一些有趣的性质, 例如 $X,Y$ 独立同分布 且 $X,Y\sim N(0,1)$, 则 $X+Y$ 与 $X-Y$ 独立且 $X+Y,X-Y\sim N(0,2)$ 

#### Transformation

下面从典型情形推导到一般的多维正态分布 :

$$
Z\sim N(0,I) \Rightarrow X=LZ\sim N(0,\Sigma) \Rightarrow Y=AX+\mu\sim N(\mu,A\Sigma A^T)
$$

首先对于 $Z_1,Z_2\sim N(0,1)$, 且 $Cov(Z_1,Z_2)=0$. 随机向量的联合 $PDF$ :

$$
f_{Z_1,Z_2}(z_1,z_2)=f_{Z_1}(z_1)f_{Z_2}(z_2)=\frac{1}{2\pi} e^{-z_1^2/2}e^{-z_2^2/2}
$$
而对于任意 $X_1,X_2 \sim N(0,1)$, 且 $Cov(X_1,X_2)=\rho$, 可以由 $Z_1,Z_2$ 线性变换得到
$$
X=LZ=
\begin{pmatrix}
1& 0 \\
\rho & \sqrt{1-\rho^2}
\end{pmatrix}
\begin{pmatrix}
Z_1\\
Z_2
\end{pmatrix}=
\begin{pmatrix}
Z_1\\
\rho Z_1+\sqrt{1-\rho^2}Z_2
\end{pmatrix}
$$
下面验证其正确性 (其中使用 [Convolution](/note/mathematics/probability/transformations/#convolution), 在 [Transformations](/note/mathematics/probability/transformations/) 中介绍) 

$$
\begin{aligned}
& Z_1\sim N(0,1)\\
& Z_2 \sim N(0,1) \Leftarrow f_{\rho Z_1+\sqrt{1-\rho^2}Z_2}(z) =\int_{-\infty}^{\infty} f_{\rho Z_1}(z-t)f_{\sqrt{1-\rho^2}Z_2}(t)\,dt \\
&=\int_{-\infty}^{\infty}\frac{1}{2\pi\sqrt{\rho^2(1-\rho^2)}}e^{-(\frac{(z-t)^2}{\rho^2}+\frac{t^2}{(1-\rho^2)})/2} \,dt\\
& = \frac{1}{\sqrt{2\pi}}e^{-z^2/2}\int^{\infty}_{-\infty}\frac{1}{\sqrt{2\pi}\sqrt{\rho^2(1-\rho^2)}}e^{(t-(1-\rho^2)z)^2/(2\rho^2(1-\rho^2))} \,dt \\
&=\frac{1}{\sqrt{2\pi}}e^{-z^2/2} \\
& Cov(X_1,X_2)=Cov(Z_1,\rho Z_1+\sqrt{1-\rho^2}Z_2)=\rho Cov(Z_1,Z_1)=\rho
\end{aligned}
$$

于是由 $Jacobi$ $transformation$ 可知 :

$$
\begin{aligned}
f_{X_1,X_2}(x_1,x_2) &=f_{Z_1,Z_2}(z_1(x_1,x_2),z_2(x_1,x_2))|\frac{\partial(z_1,z_2)}{(x_1,x_2)}|\\&=\frac{1}{2\pi\sqrt{1-\rho^2}}e^{-\frac{1}{2(1-\rho^2)}(x_1^2+x_2^2-2\rho x_1x_2)}\\
&=\frac{1}{2\pi\sqrt{|\Sigma|}}e^{-\frac{1}{2}(x^T\Sigma^{-1}x)}
\end{aligned}
$$

其中 $\Sigma$ 为协方差矩阵, $\Sigma^{-1}$ 为

$$
\begin{pmatrix}
1 & \rho \\
\rho & 1 
\end{pmatrix}^{-1}=
\frac{1}{1-\rho^2}\begin{pmatrix}
1 & -\rho \\
-\rho & 1
\end{pmatrix}
$$

进一步考虑 $Y=AX+\mu$, 有

$$
\begin{aligned}
E(Y)&=AE(X)+\mu=\mu\\
Cov(Y)&=E((Y-E(Y))(Y-E(Y))^T)=E((AX)(AX)^T)\\
&=A E(XX^T)A^T=ACov(X)A^T=A\Sigma A^T
\end{aligned}
$$

于是再根据 $shifting\, and\, scaling$, 可以得到 $Y$ 的 $PDF$ 为

$$
f_Y(y)=\frac{1}{2\pi\sqrt{|A\Sigma A^T |}}e^{-\frac{1}{2}(y-\mu)^T(A\Sigma A^T)^{-1}(y-\mu)}
$$
即 $Y\sim N(\mu,A\Sigma A^T)$. 

**注** : 对于 $k$ 维的随机向量 $Y$, 有 $f_{Y}=\frac{1}{(2\pi)^{k/2}\sqrt{|\Sigma_{Y}|}}e^{-\frac{1}{2}(y-\mu)^T\Sigma_{Y}^{-1}(y-\mu)}$, 每一个维度都会为系数提供一个 $\frac{1}{\sqrt{2\pi}}$.

而逆推上述过程, 即将一个一般 $MVN$ 归一化为经典情形的变换如下 :

$$
Y\sim N(\mu,\Sigma_Y) \Rightarrow Z=\Sigma_Y^{-\frac{1}{2}}(Y-\mu)\sim N(0,I)
$$

上述推导基本清楚地展示了 $MVN$ 的 $PDF$, 通过 $PDF$ 能够获得 $MVN$ 更多的性质, 这里不再展开. 值得一提的是, 该对理解随机向量的 $Central\, Limit\, Theorem$ (具体在 [Central Limit Theorem](/note/mathematics/probability/inequalities-and-limit-theorems/#central-limit-theorem) 中介绍) 有不小辅助作用.

#### Geometric Significance

> 本节的最后来讨论 $MVN$ 参数的几何意义

不难发现, 在 $MVN$ 的参数中, $\mu$ 仅仅改变分布在空间的位置, 更为内蕴的几何性状由 $\Sigma$ 控制, 因而简化考虑 $N(0,\Sigma)$. 

观察 $PDF$ 的指数部分 $x^T\Sigma^{-1}x=c$, 固定 $c$ 时, 该二次型为椭球(圆).
1. $\Sigma$ 的对角元决定各坐标的方差, 非对角元决定坐标间的协方差, 二者共同决定椭球(圆) 的形状.
2. $\Sigma$ 的特征向量决定椭球(圆)主轴的方向, 进而决定椭球(圆) 的方向
3. $\Sigma$ 的特征值决定主轴方向上的尺度, 进而决定椭球(圆) 的尺度

下面是二维情形 $PDF$ 的等高线图, 等高线为椭圆 :

![多维正态分布](./g3311.svg)