+++
title = "初探LLM微调"
weight=1
date = 2026-01-18
draft = false
tags=["LLM","fine-tune"]
+++
<!--more-->

> 实践项目:以特朗普为主题的LLM微调


## 实践环境

`WSL`+VScode远程连接+`conda`虚拟环境

---

## 实践方案

### 第一阶段：数据爬取 —— 语料收集

> 获取尽可能多的关于特朗普的文本数据，包括百科介绍、社交媒体互动

- 技术栈: `Requests`,`BeautifulSoup`,`Playwright`

- 任务清单：
[确定数据源] 爬取特朗普在社交平台的视频,官方推文,百度百科等
[处理反爬] 使用代理IP,模拟User-Agent以及应对验证码的初步技巧


### 第二阶段：数据管理 —— 语料库构建与存储

> 为了让模型高效学习，将零散的文本整理成结构化的数据集(JSONL格式)

- 技术栈: JONL格式转换

- 任务清单：
[文本清洗] 去除HTML标签,表情符,乱码,保留核心内容
[数据去重与过滤] 运用python脚本过滤掉较短的无效回复
[对话对构建] 构建instruction,input,output对话对


### 第三阶段：模型微调 —— 训练模型参数

> 基于现有的开源基座模型(Qwen2.5)进行指令微调 

- 技术栈: LLaMA-Factory

- 任务清单：
[选择基座] 使用7B参数的小型模型(适合个人显卡)
[模型训练] 使用LLaMA-Factory,监控Loss曲线，确保模型在学习特朗普的口头禅

---

## 实践过程

### 数据爬取阶段

> 虚拟环境配置(专门用于处理爬虫):

```bash
conda create --name Crawler python=3.10 -y
conda activate Crawler
pip install requests beautifulsoup4 playwright pandas
playwright install chromium
```

> 最初方案:
* 使用`BeautifulSoup`爬取静态百科网页
  * 反爬应对方案:模拟浏览器指纹
* 使用`Playwright`模拟滚动爬取动态社交平台
  * 反爬应对方案:模拟浏览器指纹+手动登录账号

方案问题:特朗普的静态百科网页语料较为官方,常见社交媒体上其账号出于"客观原因"语料较少

> 最终方案:
* 直接使用**Kaggle**中特朗普推文存档,共计4万余语料

### 数据管理阶段

> 虚拟环境配置:

继续使用`Crawler`环境

> 方案:
* 将获取的`CSV`格式语料处理为`JSONL`格式
* 定义风格化的指令池,随机填入Instruction
* 提取推文中全大写词汇,填入Input
* 清洗推文内容(去除链接等部分),填入Output

> 具体代码:

`dataCleaning.py`

```Python
import pandas as pd
import re
import json
import random
import os

# 定义风格化指令池
instruction_pool = [
    "What is your stance on this?",
    "Give me your thoughts on the following.",
    "Can you provide an update on this situation?",
    "What do you have to say about this topic?",
    "I'd like to hear your opinion on the matter below.",
    "Write a short statement regarding this.",
    "How would you respond to this news?",
    "Give me a quick update in your style."
]

# 提取推文中全大写词汇,填入Input
def extract_topics(text):
    # 提取Hashtags
    hashtags = re.findall(r'#\w+', text)
    # 提取全大写词句
    # 排除掉长度过短词句
    emphases = re.findall(r'\b[A-Z]{4,}\b', text) 
    # 合并并去重
    topics = list(set(hashtags + emphases))
    # 找到关键词，返回前3个
    return ", ".join(topics[:3]) if topics else ""

# 清洗推文内容,填入Output
def trump_style_clean(text):
    if pd.isna(text) or not isinstance(text, str): return ""
    text = re.sub(r'http\S+', '', text)            # 去链接
    text = re.sub(r'pic\.twitter\.com/\S+', '', text) # 去图片链接
    text = re.sub(r'<.*?>', '', text)             # 去HTML
    text = re.sub(r'RT @\w+: ', '', text)         # 去转发
    text = re.sub(r'&amp;', '&', text)             # 转义
    text = re.sub(r'@\w+', '', text)              # 删掉@提及，保留纯净语录
    text = re.sub(r'\s+', ' ', text)              # 压缩空格
    return text.strip()

def process_and_build_dataset(files, output_file="trump_persona_data.jsonl"):
    all_dfs = []
    # 批量读取与初步整合
    for file in files:
        if os.path.exists(file):
            temp_df = pd.read_csv(file)
            # 兼容不同的列名 'text' 或 'content'
            if 'content' in temp_df.columns:
                temp_df.rename(columns={'content': 'text'}, inplace=True)
            all_dfs.append(temp_df[['text']])
            print(f"📖 已加载 {file}")
    
    df = pd.concat(all_dfs, ignore_index=True)
    df.drop_duplicates(subset=['text'], inplace=True)
    dataset = []
    
    # 循环处理
    for txt in df['text']:
        cleaned_output = trump_style_clean(txt)
        # 质量控制
        if len(cleaned_output) < 20 or not re.search(r'[a-zA-Z]', cleaned_output):
            continue
        # 提取 Input
        topic_input = extract_topics(cleaned_output)
        # 构造数据条目
        dataset.append({
            "instruction": random.choice(instruction_pool),
            "input": topic_input,  
            "output": cleaned_output
        })

    # 写入 JSONL
    with open(output_file, "w", encoding="utf-8") as f:
        for entry in dataset:
            f.write(json.dumps(entry, ensure_ascii=False) + "\n")
    print(f"\n✅ 数据处理成功！")
    print(f"📊 最终获得高质量对话对: {len(dataset)} 条")
    print(f"📁 文件已保存至: {output_file}")

# 执行
files_to_process = ["realdonaldtrump.csv", "trumptweets.csv"]
process_and_build_dataset(files_to_process)
```

### 模型微调阶段

> 虚拟环境配置:

```bash
conda create --name finetune python=3.11
conda activate finetune
git clone https://github.com/hiyouga/LLaMA-Factory.git
cd LLaMA-Factory
pip install -e ".[metrics,bitsandbytes,qlora]"
```

> 方案:
* 选取Qwen2.5-7B-Instruct作为底座
    HuggingFase库网络连接问题:使用modelscope下载到本地
* 注册数据集,创建`dataset_info.json`
    ```JSON
    "trump_persona": {
    "file_name": "trump_persona_data.jsonl",
    "columns": {
        "prompt": "instruction",
        "query": "input",
        "response": "output"
    }
    }
    ```
* `llamafactory-cli webui`启动网页端操作界面调节训练参数
    |参数选项|参数选择|
    |:---|:---|
    |**Fine-tuning method**|LoRA|
    |**Batch Size**|2|
    |**Gradient Accumulation**|8|
    |**Cutoff Len**|1024|
    |**Learning Rat**e|1e-4|
    |**Epochs**|3.0|
    |**Max Grad Norm**|1.0|
    |**FP16/BF16**|BF16|

---

## 训练过程

**训练5分钟**:
![训练5分钟左右](https://cdn.jsdelivr.net/gh/wrongtrojan/bed@main/images/5min.png)
**训练35分钟**:
![训练35分钟左右](https://cdn.jsdelivr.net/gh/wrongtrojan/bed@main/images/35min.png)
**训练65分钟**:
![训练65分钟左右](https://cdn.jsdelivr.net/gh/wrongtrojan/bed@main/images/65min.png)
**训练100分钟**:
![训练100分钟左右](https://cdn.jsdelivr.net/gh/wrongtrojan/bed@main/images/100min.png)
**训练125分钟**
![训练125分钟左右](https://cdn.jsdelivr.net/gh/wrongtrojan/bed@main/images/125min.png)

---

## 实践结果

> 结果分析

* **语言风格**上有较高相似度,但**逻辑能力**不足

![对话](https://cdn.jsdelivr.net/gh/wrongtrojan/bed@main/images/dialogue.png)

> 原因分析:

* 当前训练实践太短,traningloss为2.8较高
* 数据集主要来源于特朗普推文,以短句为主,缺乏深度逻辑

