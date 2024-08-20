import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";
import "./Graph.css"; // Import your CSS file here if using CSS modules

const Graph = () => {
  const svgRef = useRef(null);
  const [tooltipContent, setTooltipContent] = useState("");
  const [tooltipStyle, setTooltipStyle] = useState({
    visibility: "hidden",
    opacity: 0,
  });

  useEffect(() => {
    const w = 1400;
    const h = 800;
    const fbBlue = d3.rgb("#3b5998");
    const fill = [
      fbBlue.brighter(2),
      fbBlue.brighter(),
      fbBlue,
      fbBlue.darker(),
    ];

    // var nodes = d3.range(211, 220).map(function (i) {
    //   return {
    //     userID: i,
    //     in: 0,
    //     out: 0,
    //   };
    // });

    // var links = [
    //   { source: 0, target: 1 },
    //   { source: 0, target: 2 },
    //   { source: 0, target: 3 },
    //   { source: 0, target: 4 },
    //   { source: 0, target: 5 },
    //   { source: 4, target: 6 },
    //   { source: 4, target: 7 },
    //   { source: 4, target: 8 },
    // ];

    const nodesData = [
      { id: 0, x: 100, y: 500, img: "https://svgsilh.com/svg/278845.svg" },
      { id: 1, x: 100, y: 100, img: "https://svgsilh.com/svg/37828.svg" },
      { id: 2, x: 100, y: 100, img: "https://svgsilh.com/svg/1390338.svg" },
      { id: 3, x: 100, y: 100, img: "https://svgsilh.com/svg_v2/1801287.svg" },
      { id: 4, x: 100, y: 100, img: "https://svgsilh.com/svg/2029797.svg" },
      { id: 5, x: 100, y: 100, img: "https://svgsilh.com/svg/1296104.svg" },
      { id: 6, x: 100, y: 100, img: "https://svgsilh.com/svg_v2/3241281.svg" },
      { id: 7, x: 100, y: 100, img: "https://svgsilh.com/svg/2798804.svg" },
      { id: 8, x: 100, y: 100, img: "https://svgsilh.com/svg_v2/147901.svg" },
      { id: 9, x: 100, y: 100, img: "https://svgsilh.com/svg_v2/3245088.svg" },
      { id: 10, x: 100, y: 100, img: "https://cdn-icons-png.flaticon.com/512/6536/6536122.png" },
      { id: 11, x: 100, y: 100, img: "https://cdn-icons-png.flaticon.com/512/616/616430.png" },
      { id: 12, x: 100, y: 100, img: "https://cdn-icons-png.flaticon.com/512/235/235349.png" },
      { id: 13, x: 100, y: 100, img: "https://icons.iconarchive.com/icons/google/noto-emoji-animals-nature/512/22221-cat-icon.png" },
    ];

    const links = [
      { source: 0, target: 1 },
      { source: 0, target: 2 },
      { source: 0, target: 3 },
      { source: 0, target: 4 },
      { source: 0, target: 7 },
      { source: 4, target: 5 },
      { source: 4, target: 6 },
      { source: 4, target: 8 },
      { source: 4, target: 9 },
      { source: 3, target: 10 },
      { source: 3, target: 11 },
      { source: 3, target: 12 },
      { source: 3, target: 13 },
    ];

    // links.forEach((d) => {
    //   nodes[d.source].out++;
    //   nodes[d.target].in++;
    // });
    const svg = d3.select(svgRef.current).attr("width", w).attr("height", h);

    const force = d3
      .forceSimulation(nodesData)
      .force("link", d3.forceLink(links).distance(200).strength(1))
      .force("charge", d3.forceManyBody().strength(-200))
      .force("center", d3.forceCenter(w / 2, h / 2))
      .force("collision", d3.forceCollide().radius(50)) 
      .force("horizontal", () => {
       nodesData[0].y = nodesData[3].y = nodesData[4].y // Align node 4 horizontally with node 0
      })
      .on("tick", ticked);

    const link = svg
      .selectAll(".link")
      .data(links)
      .enter()
      .append("line")
      .attr("class", "link");

    const node = svg
      .selectAll(".node")
      .data(nodesData)
      .enter()
      .append("g")
      .attr("class", "node")
      // .attr("xlink:href", "https://svgsilh.com/svg_v2/1801287.svg")
      // .attr("width", 32)
      // .attr("height", 32)
      // .style("fill", (d) => fill[Math.floor((d.in + 1) / 3)])
      .call(
        d3
          .drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended)
      );

    node
      .append("image")
      .attr("xlink:href", (d) => d.img)
      .attr("width", 32)
      .attr("height", 32);

    function ticked() {
      link
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y);

      // node.attr("x", (d) => d.x - 8).attr("y", (d) => d.y - 8);
      node.attr("transform", (d) => `translate(${d.x}, ${d.y})`)
    }

    function dragstarted(event, d) {
      if (!event.active) force.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event, d) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event, d) {
      if (!event.active) force.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    // svg.on("dblclick", () => {
    //   nodes.forEach((o) => {
    //     o.x += (Math.random() - 0.5) * 200;
    //     o.y += (Math.random() - 0.5) * 200;
    //   });
    //   force
    //     .nodes(nodes)
    //     .force("link", d3.forceLink(links).distance(25).strength(0.2))
    //     .alpha(1)
    //     .restart();
    // });

    // Handle node click events
    // svg.selectAll(".node").on("click", function (event, d) {
    //   const nodeElement = d3.select(this);
    //   const currentColor = nodeElement.style("fill");
    //   if (currentColor === "rgb(255, 165, 0)") {
    //     nodeElement.style("fill", "green");
    //   } else if (currentColor === "rgb(0, 128, 0)") {
    //     nodeElement.style("fill", fill[Math.floor((d.in + 1) / 3)]);
    //   } else {
    //     nodeElement.style("fill", "orange");
    //   }
    //   event.stopPropagation();
    // });

    // svg
    //   .selectAll(".node")
    //   .on("mouseover", function (event, d) {
    //     setTooltipContent(
    //       d.in === d.out
    //         ? `User ${d.userID} ${d.in} conns`
    //         : `User ${d.userID} ${d.in} in, ${d.out} out`
    //     );
    //     setTooltipStyle({
    //       visibility: "visible",
    //       opacity: 0.9,
    //       left: `${event.pageX + 15}px`,
    //       top: `${event.pageY - 5 }px`,
    //     });
    //   })
    //   .on("mouseout", () => {
    //     setTooltipStyle({ visibility: "hidden", opacity: 0 });
    //   });
  }, []);

  return (
    <>
      <svg ref={svgRef}></svg>
      <div className="tooltip" style={tooltipStyle}>
        {tooltipContent}
      </div>
    </>
  );
};

export default Graph;
