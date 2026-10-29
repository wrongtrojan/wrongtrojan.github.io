---
title: "不等式与极限定理"
slug: "inequalities-and-limit-theorems"
date: 2026-10-29
draft: false
weight: 5
tags: ["概率", "不等式", "极限定理"]
series: ["概率论"]
series_order: 5
---

> 当我们无法精确地刻画出某个概率或者期望时, 一些强大的工具包括: $simulate\, it$, $bound\, it$, $approximate\, it$. 也就是本节将要介绍的**随机采样, 不等式, 随机变量收敛和中心极限定理**.

## Random Sampling

> 随机采样提供了从有限观测估计总体概率和分布参数的方法. 为了使估计具有意义, 我们希望估计量随样本量增加而趋于目标参数. 
### I.I.D

在随机采样过程中, 如果抽取的样本之间存在依赖关系, 或者总是从某个特定空间抽取样本, 那么样本无法正确反映总体. 

为了保证样本能够帮助我们估计整体, 我们需要对采样过程作出假设, 一组最常见的假设就是: 样本相互独立并且服从同一个概率分布.

独立性确保样本之间没有概率依赖, 同分布使得样本具有相同的概率规律. 而在进一步分析样本随机变量前, 先介绍一下无偏估计的概念.
#### Unbiased estimation

当我们使用某个随机变量 $X$ 估计某个参数 $p$ 时, 如果有 $E(X)=p$, 则称 $X$ 是对参数 $p$ 的无偏估计.

下面正式研究样本随机变量, 假设 $X_1,...,X_n$ 是独立同分布的随机变量, 有 $E(X_j)=\mu$, $Var(X_j)=\sigma^2$.
### Sample Mean

样本均值被定义为 
$$
\bar{X}_n=\frac{1}{n}\sum_{j=1}^{n} X_j
$$
是对分布均值 (期望) 的估计, 其本身也是随机变量.

样本均值是对分布期望的无偏估计, 假设 $E(X_i)=\mu$, 则有

$$
E(\bar{X}_n)=\frac{1}{n}E(\sum X_j)=\frac{1}{n}\cdot n E(X_j)=E(X_j)=\mu
$$
而 $\bar{X}_n$ 的方差可以计算得到 
$$
Var(\bar{X}_n)=\frac{1}{n^2}Var(X_1+...+X_n)=\frac{\sigma^2}{n}
$$
其物理含义是随机变量 $\bar{X}_n$ 在估计样本均值时的波动情况.
### Sample Variance

样本方差被定义为

$$
S_n^2=\frac{1}{n-1}\sum_{j=1}^{n}(X_j-\bar{X}_n)^2
$$
样本标准差则是样本方差的平方根

$$
S_n=\sqrt{\frac{1}{n-1}\sum(X_j-\bar{X}_n)^2}
$$ 
与样本均值一样, 样本方差和样本标准差也是随机变量, 用于估计分布的方差和标准差. 

样本方差是无偏估计, 证明如下 

$$
\begin{aligned}
E(S_n^2)&=\frac{1}{n-1}E(\sum(X_j-\bar{X}_n)^2)\\
&=\frac{1}{n-1}E(\sum(X_j-\mu)^2-2\sum(X_j-\mu)(\bar{X}_n-\mu)+\sum (\bar{X}_n-\mu)^2)\\
&=\frac{1}{n-1}E(\sum(X_j-\mu)^2-n(\bar{X}_n-\mu)^2)\\
&=\frac{1}{n-1}(n\sigma^2-\sigma^2)=\sigma^2=Var(X_j)
\end{aligned}
$$
而样本标准差不是无偏估计, 证明 :
$$
E(S_n)\leq\sqrt{E(S_n^2)}=\sigma
$$
使用下面不等式一节中介绍的 [$Jensen$](#jensen).

#### Distribution of Sample Variance 

当 $X_j\sim N(\mu,\sigma^2)$ 时, 有
$$
\frac{(n-1)S_n^2}{\sigma^2}\sim \chi_{n-1}^2
$$
从 $Z_i\sim N(0,1)$, $\sum(Z_j-\bar{Z}_n)^2$ 出发, 再通过 [$shifting and scaling$](/note/mathematics/probability/transformations/#shifting-and-scaling) 可以证明, 这里不做展开.

---
## Inequalities

> 本节的不等式对随机变量的期望与尾部概率 (极端值概率) 的边界进行刻画.
### Cauchy-Schwarz

> $Cauchy-Schwarz$ 表明随机变量的联合期望能够被边缘分布期望控制住

对于具有有限方差的随机变量 $X,Y$, 有
$$
|E(XY)|\leq\sqrt{E(X^2)E(Y^2)}
$$
证明如下 :
$$
0\leq E((Y-tX)^2)=E(Y^2)-2tE(XY)+t^2E(X^2)
$$
取 $t=E(XY)/E(X^2)$, 则可得到 $Cauchy-Schwarz$. 下面给出一个应用它的例子.

对于非负随机变量 $X$, 如果我们想要研究 $P(X=0)$ 的上界. 注意到 

$$
X=XI(X>0)
$$

$X=0$ 时两边等于 $0$, $X>0$ 时两边等于 $X$. 则运用 $Cauchy-Schwarz$ 有

$$
E(X)=E(XI(X>0))\leq\sqrt{E(X^2)E(I(X>0))}
$$

两边平方后得到 
$$
P(X>0)\geq\frac{(E(X))^2}{E(X^2)}\Rightarrow P(X=0)\leq\frac{Var(X)}{E(X^2)}
$$
该边界有时候被称为二阶矩方法. 假设有
$$
X=I_1+...+I_n
$$
且 $I_j$ 是不相关的示性随机变量, 且 $E(I_j)=p_j$, 则

$$
Var(X)=\sum Var(I_j)=\sum p_j-\sum p_j^2=\mu-c
$$
其中 $\mu=E(X),c=\sum p_j^2$, 进而有
$$
P(X=0)\leq\frac{Var(X)}{E(X^2)}=\frac{\mu-c}{\mu^2+\mu-c}\leq\frac{1}{E(X)+1}
$$
### Jensen

> $Jensen$ 给出随机变量在具有凹凸性的函数变换下, 期望的函数值与函数值的期望之间的大小关系

对于随机变量 $X$, 如果 $g(\cdot)$ 是一个凸函数 ($g^{''}\geq0$), 则有 $E(g(X))\geq g(E(X))$; 如果 $g(\cdot)$ 是一个凹函数 $(g^{''}\leq0)$, 则有 $E(g(X))\leq g(E(X))$. 等号成立当且仅当 $g(\cdot)$ 是线性函数.

$Jensen$ 的证明只需要使用函数的凹凸性即可. 

取 $\mu=E(X)$, 并取点 $(\mu,g(\mu))$ 处的切线 $y=a+bx$. 凸函数情况下, 对于所有的 $x$ 有 $g(x)\geq a+bx$, 并在 $x=\mu$ 处取等. 因而 $g(X)\geq a+bX$, 且两边同时取期望有

$$
E(g(X))\geq a+bE(X)=g(E(X))
$$
凹函数有类似的证明.

*接下来的几个不等式给定随机变量尾部的概率边界*
### Markov

对于随机变量 $X$ 和常数 $a>0$, 假设 $E|X|$ 有限, 则有
$$
P(|X|\geq a)\leq\frac{E|X|}{a}
$$
证明如下 : 
注意到有
$$
I(\frac{|X|}{a}\geq1)\leq\frac{|X|}{a}
$$
当 $\frac{|X|}{a}\geq1$ 时, $I(...)=1\leq\frac{|X|}{a}$; 当 $\frac{|X|}{a}<1$ 时, $I(...)=0\leq\frac{|X|}{a}$. 

则两边同时取期望即可得到 $Markov$

$Markov$ 是较为粗犷的边界刻画, 因为它不对 $X$ 有除了 $E|X|$ 有限以外的其他假设. *下面几种不等式对边界有更精细的刻画*
### Chebyshev

对于期望为 $\mu$, 方差为 $\sigma^2$ 的随机变量 $X$ 和常数 $a>0$, 有

$$
P(|X-\mu|\geq a)\leq \frac{\sigma^2}{a^2}
$$

证明如下 :
$$
P(|X-\mu|\geq a)=P((X-\mu)^2\geq a^2)\leq\frac{E((X-\mu)^2)}{a^2}=\frac{\sigma^2}{a^2}
$$
如果令 $a=c\sigma$, 就会得到等价形式 
$$
P(|X-\mu|\geq c\sigma)\leq\frac{1}{c^2}
$$
 
即给出了随机变量偏离 $c$ 倍标准差的概率的上界.

$Chebyshev$ 的核心想法是先做变换, 再运用 $Markov$, 类似的操作可以得到 $Chernoff$ 不等式.

### Chernoff

> $Chernoff$ 得到一个依赖于矩母函数的概率界, 再根据具体分布控制 $MGF$

对于随机变量 $X$, 常数 $\epsilon>0$ 和变量 $t>0$, 有
$$
P(X\geq \epsilon)\leq\frac{E(e^{tX})}{e^{t\epsilon}}=e^{-t\epsilon} M_{X}(t)
$$
即先对随机变量取指数, 再运用 $Markov$

对独立采样的随机变量 $X_1,...,X_n$ 使用 $Chernoff$ 并引入 $Hoeffding$ 引理控制 $MGF$, 即得到下面的 $Hoeffding$

### Hoeffding

> $Hoeffding$ 利用有界性, 给出与具体分布无关的 $MGF$ 上界, 得到指数型概率界

对于独立随机变量 $X_1,...,X_n \in [a_i,b_i]$, 令$S_n=\sum X_i,\mu=E(S_n)$, 对 $t>0$, $Chernoff$ 给出
$$
P(S_n-\mu\geq \epsilon)\leq e^{-t\epsilon}E(e^{t(S_n-\mu)})
$$
利用变量的随机性,
$$
E(e^{t(S_n-\mu)})=\prod E(e^{t(X_i-E(X_i))})
$$
引入 $Hoeffding$ 引理 : 如果随机变量 $X$ 满足 $a\leq X\leq b$, 则
$$
E(e^{t(X-E(X))})\leq \exp(\frac{t^2(b-a)^2}{8})
$$
对任意实数 $t$ 成立, 则有
$$
E(e^{t(S_n-\mu)})\leq\prod_i \exp(\frac{t^2(b_i-a_i)^2}{8})=\exp(\frac{t^2}{8}\sum_i(b_i-a_i)^2)
$$
令 $V=\sum(b_i-a_i)^2$, 则 $Chernoff$ 的通用形式变为
$$
P(S_n-\mu\geq\epsilon)\leq \exp(-t\epsilon+\frac{t^2V}{8})
$$
进一步优化指数使 $t=\frac{4\epsilon}{V}$ 则有
$$
P(S_n-\mu\geq\epsilon)\leq \exp(-\frac{2\epsilon^2}{\sum(b_i-a_i)^2})
$$
得到 $Hoeffding$ 的上尾界.

如果不是使用 $Hoeffding$ 引理控制 $MGF$, 而是引入指数矩方法控制, 则得到下面的 $Bernstein$

### Bernstein

>$Bernstein$ 使用指数矩方法, 用方差控制 $MGF$

对独立随机变量 $X_1,...,X_n$ 令 $\mu_i=E(X_i)$, 有 $|X_i-\mu_i|\leq M$, 记

$$
S_n=\sum X_i,\mu=\sum\mu_i,V=\sum Var(X_i)
$$

同 $Hoeffding$ 的推导类似, 由 $Chernoff$ 和变量独立性, 对 $t>0$ 有
$$
P(S_n-\mu\geq \epsilon)\leq e^{-t\epsilon}\prod E(e^{tY_i})
$$
其中 $Y_i=X_i-\mu_i$, 接着对指数函数展开 $Taylor$ 级数
$$
\begin{aligned}
E(e^{tY_i})&=1+tE(Y_i)+\sum_{k=2}^{\infty}\frac{t^kE(Y_i^k)}{k!}\\
&=1+\sum_{k=2}^{\infty}\frac{t^kE(Y_i^k)}{k!}
\end{aligned}
$$
又有 $|Y_i|\leq M$ 有界, 则 $k\geq 2$ 时 

$$
|Y_i|^k\leq M^{k-2}Y_i^2,\,\,\, k!\geq2 \cdot 3^{k-2}
$$

于是对于 $t\in(0,3/M)$ 有

$$
\begin{aligned}
E(e^{tY_i})&\leq1+E(Y_i^2)\sum_{k=2}^{\infty}\frac{t^kM^{k-2}}{k!}\\
&\leq 1+ \frac{t^2E(Y_i^2)}{2}\sum_{k=2}^{\infty}(\frac{tM}{3})^{k-2}\\
&=1+\frac{t^2Var(X_i)}{2(1-Mt/3)}\\
&\leq \exp(\frac{t^2Var(X_i)}{2(1-Mt/3)})
\end{aligned}
$$

代入 $\prod E(e^{tY_i})$ 后可以得到
$$
P(S_n-\mu\geq \epsilon)\leq \exp(-t\epsilon+\frac{t^2V}{2(1-Mt/3)})
$$
优化指数项, 取 $t=\frac{\epsilon}{V+M\epsilon/3}$ 则有
$$
P(S_n-\mu\geq \epsilon)\leq \exp(-\frac{\epsilon^2}{2(V+M\epsilon/3)})
$$

得到 $Bernstein$ 的上尾界.

### Mills

> $Mills$ 给出标准正态分布尾部的概率的估计

对于 $X\sim N(0,1)$, 有
$$
P(X\geq x)\leq \frac{\varphi(x)}{x}
$$
证明如下 :
$$
\begin{aligned}
P(X\geq x)&=1-\Phi(x)=\int^{\infty}_{x}\varphi(t)\,dt\\
&\leq\frac{1}{x}\int^{\infty}_{x}t\varphi(t)\,dt
\end{aligned}
$$
又由于

$$
\varphi^{'}(t)=\sqrt{\frac{1}{2\pi}}(e^{-t^2/2})^{'}=-\sqrt{\frac{1}{2\pi}}te^{-t^2/2}=-t\varphi(t)
$$

则有
$$
\begin{aligned}
P(X\geq x)&\leq -\frac{1}{x}\int_x^{\infty}\varphi^{'}(t)\,dt\\
&=\frac{\varphi(x)}{x}
\end{aligned}
$$
得到右尾概率的上界估计. 根据对称性
$$
P(|X|\geq x)\leq\frac{2\varphi(x)}{x}
$$
得到两尾概率的估计.

---
## Convergence

> 本节将介绍随机变量序列收敛到某个分布的几种方式, 相关定理以及相互关系.

$X_1,...,X_n$ 是一系列的随机变量, $X$ 是另一个随机变量, $F_i$ 是 $X_i$ 的 $CDF$, $F$ 是 $X$ 的 $CDF$

### Converges in Probability

> 依概率收敛关注某个时刻的整体误差概率, 允许某些样本路径出错

如果对 $\forall \epsilon>0$ , 有
$$
\lim_{n\to\infty}P(|X_n-X|>\epsilon)=0
$$
则称 $X_n$ 依概率收敛到 $X$, 记作 $X_n\overset{P}{\to} X$.

不加证明的介绍依概率收敛的几个定理 :
- 如果 $X_n\overset{P}{\to}X,Y_n\overset{P}{\to}Y$, 则 $X_n+Y_n\overset{P}{\to}X+Y$
- 如果 $X_n\overset{P}{\to}X,Y_n\overset{P}{\to}Y$, 则 $X_nY_n\overset{P}{\to}XY$
- 如果 $X_n\overset{P}{\to}X$, $g$ 是连续函数, 则 $g(X_n)\overset{P}{\to}g(X)$

**弱大数定理(WLLN):** $X_1,...,X_n$ 是独立同分布的随机变量, 若 $E(|X_j|)<\infty$, 则有 $\bar{X}_n\overset{P}{\to}E(X_j)$

### Converges in Distribution

> 依分布收敛关注概率分布的变化, 不要求 $X_n$ 和 $X$ 在同一个样本点上接近

如果对使 $F$ 连续的所有 $t$, 有

$$
\lim_{n\to\infty}F_n(t)=F(t)
$$

则称 $X_n$ 依分布收敛到 $X$, 记作 $X_n\overset{d}{\to}X$.

不加证明的介绍依分布收敛的几个定理 :
- 如果 $X_n\overset{d}{\to}X,Y_n\overset{d}{\to}c$, 则$X_n+Y_n\overset{d}{\to}X+c$
- 如果 $X_n\overset{d}{\to}X,Y_n\overset{d}{\to}c$, 则$X_nY_n\overset{d}{\to}cX$
- 连续映射定理 : 如果 $X_n\overset{d}{\to}X$, $g$ 是连续函数, 则 $g(X_n)\overset{d}{\to}g(X)$
### Converges in Almost Sure

> 不允许典型样本路径出现固定幅度的误差

如果对样本空间内所有 $\omega$ 都有
$$
P(\lim_{n\to\infty}X_n(\omega)=X(\omega))=1
$$
则称 $X_n$ 几乎处处收敛到 $X$, 记作 $X_n\overset{a.s.}{\to}X$

**强大数定理(SLLN):** $X_1,...,X_n$ 是独立同分布的随机变量, 若 $E(|X_j|)<\infty$, 则有 $\bar{X}_n\overset{a.s.}{\to}E(X_j)$

### Converges in Norm

> 关注平均误差的大小, 并且 $p$ 越大对大误差就越敏感

如果对 $p$ 有
$$
\lim_{n\to\infty} E(|X_n-X|^p)=0
$$
则称 $X_n$ 依 $p$ 范数收敛到 $X$ 记作 $X_n\overset{L_p}{\to}X$.

下面不加证明的介绍依范数收敛的几个定理 :
- 如果 $X_n\overset{L_p}{\to}X,Y_n\overset{L_p}{\to}Y$, 则$X_n+Y_n\overset{L_p}{\to}X+Y$
- 如果 $p>q$, 且 $X_n\overset{L_p}{\to}X$, 则 $X_n\overset{L_q}{\to}X$, 即高范数收敛蕴含低范数收敛
### Relationship

---

## Central Limit Theorem

> 本节介绍随机变量的中心极限定理和 $delta$ 方法, 并且推广到随机向量场景 

### Central Limit Theorem

> 大数定理保证了 $\bar{X}_n$ 会收敛到 $\mu=E(X_j)$, 但并不足以渐进 $\bar{X}_n$ 本身的概率情况, 因而我们需要中心极限定理.

**CLT:** 假设 $X_1,...,X_n$ 是 $I.I.D$, 有 $E(X_j)=\mu,Var(X_j)=\sigma^2$. 令 $\bar{X}_n=\frac{1}{n}\sum X_j$, 则有
$$
Z_n=\frac{\bar{X}_n-E(\bar{X}_n)}{\sqrt{Var(\bar{X}_n)}}=\frac{\sqrt{n}(\bar{X}_n-\mu)}{\sigma}\overset{d}{\to}Z

$$
其中 $Z\sim N(0,1)$. 于是有
$$
\bar{X}_n\approx N(\mu,\frac{\sigma^2}{n})
$$
得到 $\bar{X}_n$ 的渐进分布.

下面推广到**随机向量**情形, 以二维随机向量为例

假设有 $X_1,...,X_n$ 为 $I.I.D$
$$
\begin{pmatrix}
X_{11}\\
X_{12}
\end{pmatrix}
,...,\begin{pmatrix}
X_{n1}\\
X_{n2}
\end{pmatrix}

$$
且 $E(X_i)=\mu$, $Cov(X_i)=\Sigma$. 令 $\bar{X}_n=\frac{1}{n}\sum X_j$, 有
$$
Z_n=Cov(\bar{X}_n)^{-1/2}(\bar{X}_n-E(\bar{X}_n)) \overset{d}{\to}N(0,I)
$$
易得$E(\bar{X}_n)=\mu$, 下面分析 $Cov(\bar{X}_n)$,
$$
\begin{aligned}
&\bar{X}_n=
\begin{pmatrix}
\frac{1}{n}(X_{11}+...+X_{n1})\\
\frac{1}{n}(X_{12}+...+X_{n2})\\
\end{pmatrix}\\
\Rightarrow & Cov(\bar{X}_n)=
\begin{pmatrix}
\frac{1}{n}Var(X_{j1}) & \frac{1}{n}Cov(X_{j1},X_{j2}) \\
\frac{1}{n}Cov(X_{j1},X_{j2})&\frac{1}{n}Var(X_{j2})
\end{pmatrix}\\
\Rightarrow &Cov(\bar{X}_n)=\frac{1}{n}\Sigma
\end{aligned}
$$
则上式可以化简为 

$$
Z_n=\sqrt{n}\Sigma^{-1/2}(\bar{X}_n-\mu)\approx N(0,I)
$$
则根据 [Multivariate Random Variables](/note/mathematics/probability/multivariate-random-variables/) 中推导过的多维正态分布变换, 见 [Transformation](/note/mathematics/probability/multivariate-random-variables/#transformation)

$$
\bar{X}_n\approx N(\mu,\frac{1}{n}\Sigma)
$$
得到 $\bar{X}_n$ 的渐进分布.

### Delta Method

> 在 [Transformations](/note/mathematics/probability/transformations/) 中提到, 有时我们关心的问题并不简单由随机变量刻画, 而需要经过一系列变换, $Delta$ 方法提供经过函数变化后的随机变量渐进分布的方法.

假设 
$$
\frac{\sqrt{n}(Y_n-\mu)}{\sigma}\overset{d}{\to}N(0,1)
$$
$g$ 是一个可微的函数, 且 $g^{'}(\mu)\neq 0$, 则有
$$
\frac{\sqrt{n}(g(Y_n)-g(\mu))}{|g^{'}(\mu)|\sigma}\overset{d}{\to} N(0,1)
$$
换言之, 
$$
g(Y_n)\approx N(g(\mu),(g^{'}(\mu))^2\frac{\sigma^2}{n})
$$
得到 $g(Y_n)$ 的渐进分布. 下面推广到随机向量情形

假设 $Y_n=(Y_{n1},...,Y_{nk})$, 有
$$
\sqrt{n}(Y_n-\mu)\overset{d}{\to}N(0,\Sigma)
$$
$g$ 是一个可微的函数, 且 $\nabla g(\mu)\neq 0$, 则有
$$
\sqrt{n}(g(Y_n)-g(\mu))\overset{d}{\to} N(0,\nabla g(\mu)^T\Sigma\nabla g(\mu))
$$
换言之, 
$$
g(Y_n)\approx N(g(\mu),\frac{1}{n}\nabla g(\mu)^T\Sigma\nabla g(\mu))
$$
得到 $g(Y_n)$ 的渐进分布.