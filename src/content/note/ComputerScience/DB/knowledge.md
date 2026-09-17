---
title: "Neo4j 入门"
slug: "neo4j"
date: 2026-09-17
draft: false
weight: 1
tags: ["Neo4j", "图数据库", "Cypher"]
series: ["数据库"]
series_order: 1
---

## Install

官方给出的 `Create a Noe4j instance` 方法一共有五种,包括:
- Fully managed cloud service, 完全托管在云服务器上
- Self-managed cloud service, 使用自己的配置在云平台上部署
- self-managed local deployment, 使用 `Neo4j Desktop` 部署
- **Neo4j on Docker, 使用 `Docker` 部署**
- Noe4j on K8S, 有集群部署需求时使用 `K8S`部署

这里着重选取 使用 `Docker` 部署

```yml
services:
	neo4j:
		image: neo4j:2026.08.1 # 镜像版本号
		container_name: neo4j # 容器名称
	
	ports:
		# 宿主端口:容器端口
		- "7474:7474" # browser
		- "7687:7687" # blot, python 交互使用该端口 
	
	environment:
		NEO4J_AUTH: neo4j/12345678

	volumes:
		- neo4j-data:/data # 挂载卷, 这里使用 named volumes 让 docker 管理

volumes:
	neo4j-data:
```

在 `bash` 中使用 docker command 启动 `compose.yml` 

```bash
docker compose up -d # 启动
docker ps # 查询启动情况
```
## DataStruct

### Nodes

节点是图中的实体, neo4j 中的节点:
1. 具有`Label`, 表示某个类别或身份等, 如 `(p:Person)`
2. 具有`Properties`, 通常使用键值对的形式表明属性, 如 `{name:Alice}`
3. 能够 `indexed` 以及与 `constraints` 关联

### Relationships

关系提供两个节点之间的联系, noe4j 中的关系:
1. 必须有头节点和尾节点
2. 必须有向
3. 和节点一样具有属性

## Cypher

> Cypher 是 Neo4j 的声明式图查询语言, 和 SQL 语言有相似之处

### Create 创建

#### `CREATE`

1. 创建节点

```cypher
CREATE (p:Person {name: "Alice", age:20})
```

2. 创建关系

```cypher
CREATE (a:Person {name: "Alice"})-[:KNOWS]->(b:Person {name: "Bob"})
```

#### `MERGE`

存在则匹配, 不存在则创建

```cypher
MERGE (p:Person {name: "Alice"})
```

### Query 查询

#### `MATCH`

1. 查找节点

```cypher
MATCH (p:Person)
RETURN p
```

2. 查找关系

```cypher
MATCH (a:Person {name: "Alice"})-[:KNOWS]->(b:Person)
RETURN b
```

#### `RETURN`

返回查询结果

```cypher
MATCH (p:Person)
RETURN p.name, p.age
```

#### `WHERE`

做条件筛选

```cypher
MATCH (p:Person)
WHERE p.age >= 18
RETURN p
```

#### `OPTIONAL MATCH`

可选匹配, 常用场景是和 `MATCH` 连用, 关系不匹配时仍保留

```cypher
MATCH (p:Person)
OPTIONAL MATCH (p)-[:WORKS_AT]->(c:Company)
RETURN p, c
```

#### `ORDER BY`

给结果排序

```cypher
MATCH (p:Person)
RETURN p
ORDER BY p.age DESC
```

#### `LIMIT`

限制结果数量

```cypher
MATCH (p:Person)
RETURN p
LIMIT 10
```

#### `SKIP`

跳过部分结果

```cypher
MATCH (p:Person)
RETURN p
SKIP 10
LIMIT 10
```

### Delete 删除

#### `DELETE`

1. 删除节点

如果节点并非孤立节点, 直接 `DELETE` 会报错

```cypher
MATCH (p:Person {name: "Alice"})
DELETE p
```

2. 删除关系

```cypher
MATCH (a)-[r:KNOWS]->(b)
DELETE r
```

#### `DETACH DELETE`

删除所有节点及其所有关系

```cypher
MATCH (p:Person {name: "Alice"})
DETACH DELETE p
```

### Update 更新

#### `SET`

1. 修改属性

``` cypher
MATCH (p:Person {name: "Alice"})
SET p.age=21
```

2. 添加属性/标签

```cypher
SET p.city="Wuhan"
SET p:Student
```

#### `REMOVE`

1. 删除属性

```cypher
MATCH (p:Person {name: "Alice"})
REMOVE p.age
```

2. 删除标签

```cypher
REMOVE p:Student
```

### Control 控制

#### `WITH`

传递中间结果

```cypher
MATCH (p:Person)
WITH p
WHERE p.age >= 18
RETURN p
```

#### `UNWIND`

将列表展开

```cypher
UNWIND ["Alice", "Bob", "Charlie"] AS name
RETURN name
```

#### `CALL`

调用 `Neo4j` 的过程或者执行子查询

```cypher
CALL db.labels()
```

### Aggregate 聚合

#### count()

计数

```cypher
MATCH (p:Person)
RETURN count(p)
```

#### collect()

收集成列表

```cypher
MATCH (p:Person)
RETURN collect(p.name)
```

#### sum()/avg()/min()/max()

统计和/均/最值

```cypher
MATCH (p:Person)
RETURN avg(p.age)
```

## Interact With Python

> Pyhton 通过官方的 Python Driver 与数据库交互


```plain
┌──────────────────────┐
│    Python Program    │
│                      │
│  Neo4j Python Driver │
└──────────┬───────────┘
           │
           │ Bolt
           │ localhost:7687
           ↓
┌──────────────────────┐
│    Neo4j Server      │
│                      │
│  Database: neo4j     │
│                      │
│  Nodes / Relations   │
└──────────────────────┘
```

1. 安装包

``` bash
pip install neo4j
```

2. 创建 `Driver`

```python
from neo4j import GraphDatabase

URI="neo4j://localhost:7687" # 与 docker 创建容器时一致
AUTH=("neo4j","12345678") # 容器名与密码

driver=GraphDatabase.driver(URI, auth=AUTH) # 创建 driver

print(driver.verify_connectivity()) # 验证连接
```

3. 发送 `Cypher`

```python
# execute_query(cypher:str,parameters) -> tuple[records,summary,keys]

# 参数
## cypher 语句以字符串的形式传递,语句中的参数可借助 `parameters` 传递

## 方式一: $ + named_parameters

driver.execute_query(
    """
    MATCH (p:Person {name: $name})
    RETURN p
    """,
    name="Alice",
    database_="neo4j"
)

## 方式二: parameters_ = ...

parameters = {
    "name": "Alice",
    "age": 20
}

driver.execute_query(
    """
    MATCH (p:Person {name: $name})
    SET p.age = $age
    """,
    parameters_=parameters,
    database_="neo4j"
)

# 返回值

## records 保存查询的结果, 数据类型类似于 list[dict]
## summary 保存查询的执行信息, 包括执行对象,用时等
## keys 保存描述返回的字段

records, summary, keys = driver.execute_query(
    """
    MATCH (p:Person)
    RETURN p.name AS name, p.age AS age
    """,
    database_="neo4j"
)

for record in records:
    print(record["name"], record["age"])

```

## Graph Visualize

### 可视化的目的

1. 数据探索, 探查数据库中有什么数据
2. 应用中展示, 将数据以图的方式展示

### 可视化的方式

1. 在 `Neo4j browser` 中查询, 返回结果包括节点,关系和路径时即以图形式展示
2. 在 `Neo4j bloom` 中交互式(搜索/展开/筛选/查看)查询, 数据以图形式展示
3. 使用 Python 查询得到返回结果后, 使用 Python 的图可视化库绘制
	- NetworkX 库建立、操作并绘制静态图
	- PyVis 生成 html 交互式 Web 网络图

## Information Presentation

### 表格展示

> 表格适合数据量大、统计、导出csv等场景


查询:

```cypher
MATCH (p:Person)
RETURN p.name AS name, p.age AS age
```

返回:

```plain
name      age
─────────────
Alice     20
Bob       21
Charlie   19
```

### 文本/JSON 展示

> 文本或 json 格式便于机器操作和处理

```json
{
  "person": {
    "name": "Alice",
    "age": 20
  },
  "company": {
    "name": "Google"
  }
}
```

### 图结构展示

> 展示关系

```plain
Person ──AUTHORED──> Paper
   │                    │
   │                    │ CITES
   ↓                    ↓
University <──────── Paper
```

### 实体详情展示

> 某个实体的具体信息

```plain
┌─────────────────────────┐
│ Person                  │
├─────────────────────────┤
│ name: Alice             │
│ age: 20                 │
│ university: PKU         │
└─────────────────────────┘

Relationships
───────────────────
KNOWS → Bob
AUTHORED → Paper A
WORKS_AT → Lab X
```

### 统计信息展示

> 展示整体情况

```
Knowledge Graph Statistics

Nodes
───────────────────
Person       12,431
Paper        38,291
University    532
Topic        4,821

Relationships
────────────────────
AUTHORED      52,391
CITES         91,204
WORKS_AT      13,284
ABOUT         42,102
```
