---
title: "用python词云完成对十五五规划的内容与自动轨迹绘制"
date: 2026-11-16 11:35:59
author: "Like-dejavu"
---

---
date: 2026-11-12
categories: Python作业
---

#自动轨迹绘制
```
import turtle as t


t.title('自动轨迹绘制')
t.setup(800,600,0,0)
t.pencolor("red")
t.pensize(5)

dls=[]
with open ("data.txt") as f:
    for line in f:
        line = line.replace("\n","")
        dls.append(list(map(eval,line.split(","))))

for i in range(len(dls)):
    t.pencolor(dls[i][3],dls[i][4],dls[i][5])
    t.forward(dls[i][0])
    if dls[i][1]:
        t.right(dls[i][2])
    else:
        t.left(dls[i][2])
t.done()
```


#用python词云完成对十五五规划的内容
```
import random
import re
import urllib.request
from pathlib import Path

from wordcloud import WordCloud

BASE = Path(__file__).resolve().parent
TXT = BASE / "data" / "十五五规划纲要.txt"
OUT = BASE / "output" / "十五五词云_仅wordcloud.png"
SOURCE = "https://www.gov.cn/yaowen/liebiao/202603/content_7062633.htm"

# 中文字体（词云必须指定，否则全是方块）
FONT = "C:/Windows/Fonts/simhei.ttf"

# 固定深红金色板：比 colormap="Reds" 更清楚，低频词不会淡到看不见
PALETTE = ["#9E1B32", "#B62838", "#C33C2E", "#D2691E", "#C08A2E", "#7A2636"]


def color_func(word, font_size, position, orientation, random_state=None, **kwargs):
    return (random_state or random).choice(PALETTE)

# 规划关键词表：想加词、减词，直接改这里就行
WORDS = """
中国式现代化 高质量发展 新质生产力 现代化产业体系 科技自立自强 全国统一大市场 十五五
人工智能 未来产业 新兴产业 战略性新兴产业 先进制造业 传统产业 实体经济 数字经济 智能经济
科技创新 产业创新 关键核心技术 原始创新 基础研究 科技成果转化 知识产权 数据要素 算力 算法 大模型
具身智能 机器人 低空经济 量子科技 生物制造 脑机接口 集成电路 工业母机 高端装备 生物医药 新材料
新能源 新型储能 新型电力系统 绿色低碳 绿色转型 碳达峰 碳中和 碳排放 生态文明 污染防治 生态修复
美丽中国 乡村全面振兴 乡村振兴 粮食安全 耕地保护 农业农村现代化 区域协调发展 新型城镇化 城乡融合
城市更新 共同富裕 基本公共服务 社会保障 就业优先 高质量充分就业 生育支持 养老服务 银发经济
托育服务 健康中国 医疗卫生 公立医院 教育强国 科技强国 人才强国 制造强国 质量强国 网络强国
文化强国 高等教育 职业教育 义务教育 学前教育 立德树人 中华优秀传统文化 文化产业 文化事业
民营经济 营商环境 公平竞争 专精特新 高水平对外开放 制度型开放 共建一带一路 人类命运共同体
粤港澳大湾区 京津冀 长三角 长江经济带 黄河流域 西部大开发 东北振兴 中部崛起
国家安全 总体国家安全观 能源安全 产业链供应链 防灾减灾 应急管理 公共卫生 国防和军队现代化
全过程人民民主 全面依法治国 全面从严治党 党的全面领导 扩大内需 提振消费 国内大循环 国际循环
新发展格局 政府投资 民间投资 财政政策 货币政策 宏观治理 绿色金融 普惠金融 数字金融
投资于人 投资于物 重大工程项目 规划实施 基础设施 供给侧 需求侧
发展 建设 创新 改革 开放 安全 服务 治理 产业 企业 科技 教育 就业 消费 投资 生态 能源 交通
文化 医疗 养老 住房 收入 乡村 城市 区域 市场 金融 数字 智能 绿色 低碳 现代化 高质量 人民群众
""".split()


def load_text() -> str:
    """优先读本地缓存；没有就用标准库联网抓纲要全文。"""
    if TXT.exists():
        text = TXT.read_text(encoding="utf-8")
    else:
        req = urllib.request.Request(SOURCE, headers={"User-Agent": "Mozilla/5.0"})
        page = urllib.request.urlopen(req, timeout=60).read().decode("utf-8", "ignore")
        start = page.find('id="UCAP-CONTENT"')
        body = page[page.find(">", start) + 1:]
        paras = [re.sub(r"<[^>]+>", "", p) for p in re.findall(r"<p[^>]*>(.*?)</p>", body, re.S)]
        text = "\n".join(paras)
        TXT.parent.mkdir(exist_ok=True)
        TXT.write_text(text, encoding="utf-8")

    # 剔除目录（章节标题会在正文重复出现，重复计数会拉高词频）
    first = text.find("第一篇")
    second = text.find("第一篇", first + 1)
    return text[second:] if second > 0 else text


def build_freq(text: str) -> dict:
    """长词优先、命中后从文本中剔除，避免「高质量发展」被重复算进「发展」。"""
    freq, rest = {}, text
    for w in sorted(set(WORDS), key=lambda x: (-len(x), x)):
        n = rest.count(w)
        if n:
            freq[w] = n
            rest = rest.replace(w, " ")
    return freq


def main() -> None:
    text = load_text()
    freq = build_freq(text)
    print(f"正文 {len(text):,} 字，命中 {len(freq)} 个关键词")
    print("Top 15:", sorted(freq.items(), key=lambda x: -x[1])[:15])

    OUT.parent.mkdir(exist_ok=True)
    wc = WordCloud(
        font_path=FONT,
        width=1600, height=1000,
        background_color="white",
        color_func=color_func,
        max_words=180,
        relative_scaling=0.45,
        prefer_horizontal=1.0,   # 全部横排，中文更好读，也避免竖排贴边被裁
        margin=6,
        random_state=42,
        collocations=False,
    ).generate_from_frequencies(freq)
    wc.to_file(OUT)
    print("已保存:", OUT)


if __name__ == "__main__":
    main()

```

<!-- issue: 8 -->
