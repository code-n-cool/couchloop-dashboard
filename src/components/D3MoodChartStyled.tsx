import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { ProcessedPoint } from "../types";

export default function D3MoodChartStyled({ data, height = 320 }: { data: ProcessedPoint[]; height?: number }) {
  const ref = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const width = containerRef.current.clientWidth;
    const margin = { top: 20, right: 12, bottom: 28, left: 36 };
    const w = width - margin.left - margin.right;
    const h = height - margin.top - margin.bottom;

    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();

    const g = svg
      .attr("viewBox", `0 0 ${w + margin.left + margin.right} ${h + margin.top + margin.bottom}`)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const parse = d3.timeParse("%Y-%m-%d");
    const points = data.map(d => ({ date: parse(d.date) as Date, score: d.score, rolling: d.rolling, isAnomaly: d.isAnomaly }));

    const x = d3.scaleTime().domain(d3.extent(points, d => d.date) as [Date, Date]).range([0, w]);
    const y = d3.scaleLinear().domain([1,5]).range([h, 0]);

    // bands
    g.append("rect").attr("x", 0).attr("y", y(5)).attr("width", w).attr("height", y(3.6)-y(5)).attr("fill","#F3FFF8").attr("opacity",0.35);
    g.append("rect").attr("x", 0).attr("y", y(3.6)).attr("width", w).attr("height", y(2.4)-y(3.6)).attr("fill","#FFFCEB").attr("opacity",0.25);
    g.append("rect").attr("x", 0).attr("y", y(2.4)).attr("width", w).attr("height", y(1)-y(2.4)).attr("fill","#FFF3F2").attr("opacity",0.30);

    g.append("g").attr("transform", `translate(0,${h})`).call(d3.axisBottom(x).ticks(Math.min(12, points.length)).tickFormat(d3.timeFormat("%b %d") as any));
    g.append("g").call(d3.axisLeft(y).ticks(5).tickFormat(d3.format("d")));

    const area = d3.area<any>().x(d => x(d.date)).y0(h).y1(d => y(d.score)).curve(d3.curveMonotoneX);
    const gradId = `grad-${Math.floor(Math.random()*100000)}`;

    // defs gradient
    const defs = svg.append("defs");
    const gradient = defs.append("linearGradient").attr("id", gradId).attr("x1","0").attr("x2","0").attr("y1","0").attr("y2","1");
    gradient.append("stop").attr("offset","0%").attr("stop-color","#3AAFA9").attr("stop-opacity","0.14");
    gradient.append("stop").attr("offset","100%").attr("stop-color","#3AAFA9").attr("stop-opacity","0.02");

    g.append("path").datum(points).attr("d", area as any).attr("fill", `url(#${gradId})`).attr("stroke","none");

    const line = d3.line<any>().x(d => x(d.date)).y(d => y(d.score)).curve(d3.curveMonotoneX);
    g.append("path").datum(points).attr("d", line as any).attr("fill","none").attr("stroke","#2E8B84").attr("stroke-width",1.8);

    if (points.some(p=>p.rolling!==undefined)) {
      const rline = d3.line<any>().x(d => x(d.date)).y(d => y(d.rolling)).curve(d3.curveMonotoneX);
      g.append("path").datum(points).attr("d", rline as any).attr("fill","none").attr("stroke","#D9776C").attr("stroke-width",2.2).attr("opacity",0.95);
    }

    g.selectAll(".anomaly").data(points.filter(p=>p.isAnomaly)).enter().append("circle")
      .attr("cx", d => x(d.date)).attr("cy", d => y(d.score)).attr("r", 5).attr("fill","#FF6B6B");

    // gentle hover tooltip
    const tooltip = d3.select(containerRef.current).append("div")
      .style("position","absolute").style("padding","6px").style("background","rgba(0,0,0,0.75)").style("color","white").style("font-size","12px").style("border-radius","6px").style("visibility","hidden");

    g.selectAll("rect.overlay")
      .data(points)
      .enter()
      .append("rect")
      .attr("x", (d,i) => i===0 ? 0 : x(points[i-1].date))
      .attr("y", 0)
      .attr("width", w/points.length + 2)
      .attr("height", h)
      .attr("fill", "transparent")
      .on("mousemove", function(event, d) {
        tooltip.style("visibility","visible").text(`${d3.timeFormat("%b %d, %Y")(d.date)} • ${d.score}`);
        tooltip.style("left",(event.pageX+10)+"px").style("top",(event.pageY-28)+"px");
      })
      .on("mouseout", ()=> tooltip.style("visibility","hidden"));

    return () => { tooltip.remove(); };
  }, [data, height]);

  return (
    <div ref={containerRef} style={{ width: "100%", height }}>
      <svg ref={ref} style={{ width: "100%", height: "100%" }} />
    </div>
  );
}
