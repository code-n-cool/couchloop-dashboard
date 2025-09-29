import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { ProcessedPoint } from "../types";

type Props = { data: ProcessedPoint[]; height?: number };

export default function D3MoodChart({ data, height = 360 }: Props) {
  const ref = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const width = containerRef.current.clientWidth;
    const margin = { top: 18, right: 12, bottom: 30, left: 36 };
    const w = Math.max(320, width) - margin.left - margin.right;
    const h = height - margin.top - margin.bottom;

    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();

    const g = svg
      .attr("viewBox", `0 0 ${w + margin.left + margin.right} ${h + margin.top + margin.bottom}`)
      .attr("role", "img")
      .attr("aria-label", "Mood over time chart (D3)")
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const parse = d3.timeParse("%Y-%m-%d");
    const points = data.map(d => ({ date: parse(d.date) as Date, score: d.score, rolling: d.rolling, isAnomaly: d.isAnomaly }));

    const x = d3.scaleTime().domain(d3.extent(points, d => d.date) as [Date, Date]).range([0, w]);
    const y = d3.scaleLinear().domain([1, 5]).range([h, 0]);

    const xAxis = d3.axisBottom<Date>(x).ticks(Math.min(10, points.length)).tickFormat(d3.timeFormat("%b %d"));
    const yAxis = d3.axisLeft(y).ticks(5).tickFormat(d3.format("d"));

    g.append("g").attr("transform", `translate(0,${h})`).call(xAxis);
    g.append("g").call(yAxis);

    const line = d3.line<any>().x(d => x(d.date)).y(d => y(d.score)).curve(d3.curveMonotoneX);
    g.append("path").datum(points).attr("d", line as any).attr("fill", "none").attr("stroke", "#1f77b4").attr("stroke-width", 1.5);

    if (points.some(p=>p.rolling!==undefined)) {
      const rollLine = d3.line<any>().x(d => x(d.date)).y(d => y(d.rolling)).curve(d3.curveMonotoneX);
      g.append("path").datum(points).attr("d", rollLine as any).attr("fill","none").attr("stroke","#ff7f0e").attr("stroke-width",2);
    }

    // anomalies
    g.selectAll(".dot")
      .data(points.filter(p => p.isAnomaly))
      .enter()
      .append("circle")
      .attr("cx", d => x(d.date))
      .attr("cy", d => y(d.score))
      .attr("r", 4)
      .attr("fill", "red")
      .attr("aria-hidden", "true");

    // tooltip (simple)
    const tooltip = d3.select(containerRef.current).append("div")
      .style("position","absolute")
      .style("visibility","hidden")
      .style("padding","6px")
      .style("background","rgba(0,0,0,0.8)")
      .style("color","white")
      .style("border-radius","4px")
      .style("font-size","12px");

    g.selectAll("rect")
      .data(points)
      .enter()
      .append("rect")
      .attr("x", d => x(d.date) - (w/points.length)/2)
      .attr("y", 0)
      .attr("width", (w/points.length))
      .attr("height", h)
      .attr("fill", "transparent")
      .on("mousemove", function(event, d) {
        tooltip.style("visibility","visible").text(`${d3.timeFormat("%b %d, %Y")(d.date)} — ${d.score}`);
        tooltip.style("left", (event.pageX + 10) + "px").style("top", (event.pageY - 28) + "px");
      })
      .on("mouseout", ()=>tooltip.style("visibility","hidden"));

    // cleanup tooltip on unmount
    return () => { tooltip.remove(); };

  }, [data, height]);

  return (
    <div ref={containerRef} style={{ width: "100%", height }}>
      <svg ref={ref} style={{ width: "100%", height: "100%" }} />
    </div>
  );
}
