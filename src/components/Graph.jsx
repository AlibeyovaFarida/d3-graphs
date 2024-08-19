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
    const h = 600;
    const fbBlue = d3.rgb("#3b5998");
    const fill = [
      fbBlue.brighter(2),
      fbBlue.brighter(),
      fbBlue,
      fbBlue.darker(),
    ];

    var nodes = d3.range(211, 220).map(function (i) {
      return {
        userID: i,
        in: 0,
        out: 0,
      };
    });

    var links = [
      { source: 0, target: 1 },
      { source: 0, target: 2 },
      { source: 0, target: 3 },
      { source: 0, target: 4 },
      { source: 0, target: 5 },
      { source: 4, target: 6 },
      { source: 4, target: 7 },
      { source: 4, target: 8 },
    ];
    links.forEach((d) => {
      nodes[d.source].out++;
      nodes[d.target].in++;
    });
    const svg = d3.select(svgRef.current).attr("width", w).attr("height", h);

    const force = d3
      .forceSimulation(nodes)
      .force("link", d3.forceLink(links).distance(200).strength(0.01))
      .force("charge", d3.forceManyBody().strength(-10))
      .force("center", d3.forceCenter(w / 2, h / 2))
      .on("tick", ticked);

    const link = svg
      .selectAll(".link")
      .data(links)
      .enter()
      .append("line")
      .attr("class", "link");

    const node = svg
      .selectAll(".node")
      .data(nodes)
      .enter()
      .append("image")
      .attr("class", "node")
      .attr("xlink:href", "https://svgsilh.com/svg_v2/1801287.svg")
      .attr("width", 32)
      .attr("height", 32)
      .style("fill", (d) => fill[Math.floor((d.in + 1) / 3)])
      .call(
        d3
          .drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended)
      );

    function ticked() {
      link
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y);

      node.attr("x", (d) => d.x - 8).attr("y", (d) => d.y - 8);
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
