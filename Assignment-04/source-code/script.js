async function loadCSV() {

    const response = await fetch("mumbai_indians_match.csv");
    const data = await response.text();
    const rows = data.trim().split("\n").slice(1);

    let runs = [];
    let foursTotal = 0;
    let sixesTotal = 0;
    let playerStats = {};

    rows.forEach(row => {

        const cols = row.split(",");
        if (cols.length < 8) return;

        const run = Number(cols[2]);
        const player = cols[4];

        runs.push(run);
        foursTotal += Number(cols[6]);
        sixesTotal += Number(cols[7]);

        if (!playerStats[player]) {
            playerStats[player] = { runs: 0, balls: 0 };
        }

        playerStats[player].runs += run;
        playerStats[player].balls += 6;
    });

    // Update Cards
    const totalRuns = d3.sum(runs);
    const runRate = (totalRuns / 20).toFixed(2);

    document.getElementById("totalRuns").innerText = totalRuns;
    document.getElementById("wickets").innerText = 5;
    document.getElementById("runRate").innerText = runRate;

    // Fill Player Table
    let tableHTML = "";

    for (let player in playerStats) {
        const r = playerStats[player].runs;
        const b = playerStats[player].balls;
        const sr = ((r / b) * 100).toFixed(2);

        tableHTML += `
            <tr class="border-b border-gray-700">
                <td class="py-2">${player}</td>
                <td>${r}</td>
                <td>${b}</td>
                <td>${sr}</td>
            </tr>
        `;
    }

    document.getElementById("playerTable").innerHTML = tableHTML;

    createBarChart(runs);
    createLineChart(runs);
    createPieChart(foursTotal, sixesTotal);
}

// ================= BAR CHART =================
function createBarChart(data) {

    d3.select("#barChart").html("");

    const width = 600;
    const height = 350;
    const margin = 50;

    const svg = d3.select("#barChart")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    const x = d3.scaleBand()
        .domain(d3.range(1, data.length + 1))
        .range([margin, width - margin])
        .padding(0.2);

    const y = d3.scaleLinear()
        .domain([0, d3.max(data)])
        .range([height - margin, margin]);

    // Bars
    svg.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", (d, i) => x(i + 1))
        .attr("y", d => y(d))
        .attr("width", x.bandwidth())
        .attr("height", d => height - margin - y(d))
        .attr("fill", "#60a5fa");

    // X Axis
    svg.append("g")
        .attr("transform", `translate(0,${height - margin})`)
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("fill", "white");

    // Y Axis
    svg.append("g")
        .attr("transform", `translate(${margin},0)`)
        .call(d3.axisLeft(y))
        .selectAll("text")
        .attr("fill", "white");
}

function createLineChart(data) {

    d3.select("#runChart").html("");

    const width = 600;
    const height = 350;
    const margin = 50;

    const svg = d3.select("#runChart")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    const x = d3.scaleLinear()
        .domain([1, data.length])
        .range([margin, width - margin]);

    const y = d3.scaleLinear()
        .domain([0, d3.max(data)])
        .range([height - margin, margin]);

    const line = d3.line()
        .x((d, i) => x(i + 1))
        .y(d => y(d));

    svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "#00eaff")
        .attr("stroke-width", 3)
        .attr("d", line);

    // Dots
    svg.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", (d, i) => x(i + 1))
        .attr("cy", d => y(d))
        .attr("r", 4)
        .attr("fill", "#facc15");

    // X Axis
    svg.append("g")
        .attr("transform", `translate(0,${height - margin})`)
        .call(d3.axisBottom(x).ticks(data.length))
        .selectAll("text")
        .attr("fill", "white");

    // Y Axis
    svg.append("g")
        .attr("transform", `translate(${margin},0)`)
        .call(d3.axisLeft(y))
        .selectAll("text")
        .attr("fill", "white");
}
// ================= PIE CHART =================
function createPieChart(fours, sixes) {

    d3.select("#boundaryChart").html("");

    const width = 300;
    const height = 300;
    const radius = 150;

    const svg = d3.select("#boundaryChart")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${radius},${radius})`);

    const data = [
        { label: "Fours", value: fours },
        { label: "Sixes", value: sixes }
    ];

    const color = d3.scaleOrdinal()
        .range(["#facc15", "#f97316"]);

    const pie = d3.pie()
        .value(d => d.value);

    const arc = d3.arc()
        .innerRadius(0)
        .outerRadius(radius);

    svg.selectAll("path")
        .data(pie(data))
        .enter()
        .append("path")
        .attr("d", arc)
        .attr("fill", (d, i) => color(i));
    svg.selectAll("text")
    .data(pie(data))
    .enter()
    .append("text")
    .text(d => d.data.label + " (" + d.data.value + ")")
    .attr("transform", d => `translate(${arc.centroid(d)})`)
    .attr("text-anchor", "middle")
    .attr("fill", "white")
    .attr("font-size", "12px");
}

loadCSV();