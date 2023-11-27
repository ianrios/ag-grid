"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MiniDoughnut = void 0;
const miniChart_1 = require("../miniChart");
const ag_charts_community_1 = require("ag-charts-community");
const toRadians = ag_charts_community_1._Scene.toRadians;
class MiniDoughnut extends miniChart_1.MiniChart {
    constructor(container, fills, strokes, centerRadiusScaler = 0.6, tooltipName = "doughnutTooltip") {
        super(container, tooltipName);
        const radius = (this.size - this.padding * 2) / 2;
        const center = radius + this.padding;
        const angles = [
            [toRadians(-90), toRadians(30)],
            [toRadians(30), toRadians(120)],
            [toRadians(120), toRadians(180)],
            [toRadians(180), toRadians(210)],
            [toRadians(210), toRadians(240)],
            [toRadians(240), toRadians(270)]
        ];
        this.sectors = angles.map(([startAngle, endAngle]) => {
            const sector = new ag_charts_community_1._Scene.Sector();
            sector.centerX = center;
            sector.centerY = center;
            sector.innerRadius = radius * centerRadiusScaler;
            sector.outerRadius = radius;
            sector.startAngle = startAngle;
            sector.endAngle = endAngle;
            sector.stroke = undefined;
            sector.strokeWidth = 1;
            return sector;
        });
        this.updateColors(fills, strokes);
        this.root.append(this.sectors);
    }
    updateColors(fills, strokes) {
        this.sectors.forEach((sector, i) => {
            sector.fill = fills[i % fills.length];
            sector.stroke = strokes[i % strokes.length];
        });
    }
}
exports.MiniDoughnut = MiniDoughnut;
MiniDoughnut.chartType = 'doughnut';
