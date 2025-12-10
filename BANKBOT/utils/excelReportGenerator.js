import ExcelJS from 'exceljs';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Generate Excel report for Bank Rank
 * @param {Array} topUsers - Array of top users
 * @param {String} bankName - Bank/alliance name
 * @returns {Promise<String>} Path to the generated Excel file
 */
export async function generateBankRankReport(topUsers, bankName = 'Kingdom Bank') {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Bank Rank Report');

    // Set column widths
    worksheet.columns = [
        { header: 'Rank', key: 'rank', width: 8 },
        { header: 'User Name', key: 'name', width: 25 },
        { header: 'Food', key: 'food', width: 15 },
        { header: 'Wood', key: 'wood', width: 15 },
        { header: 'Stone', key: 'stone', width: 15 },
        { header: 'Gold', key: 'gold', width: 15 },
        { header: 'Total RSS', key: 'totalRss', width: 15 },
        { header: 'Weeks', key: 'weeks', width: 10 },
        { header: 'Avg/Week', key: 'avgPerWeek', width: 15 }
    ];

    // Format header row
    const headerRow = worksheet.getRow(1);
    headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    headerRow.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFD700' } // Gold color
    };
    headerRow.alignment = { horizontal: 'center', vertical: 'center' };

    // Add data rows
    topUsers.forEach((user, index) => {
        const row = worksheet.addRow({
            rank: index + 1,
            name: user.name,
            food: user.food,
            wood: user.wood,
            stone: user.stone,
            gold: user.gold,
            totalRss: user.totalRss,
            weeks: user.totalWeeks,
            avgPerWeek: user.avgPerWeek
        });

        // Format data rows
        row.alignment = { horizontal: 'right', vertical: 'center' };
        
        // Add number formatting for currency-like display
        row.getCell('food').numFmt = '#,##0';
        row.getCell('wood').numFmt = '#,##0';
        row.getCell('stone').numFmt = '#,##0';
        row.getCell('gold').numFmt = '#,##0';
        row.getCell('totalRss').numFmt = '#,##0';
        row.getCell('avgPerWeek').numFmt = '#,##0';

        // Add medal emoji for top 3
        if (index === 0) {
            row.getCell('rank').value = '🥇 1';
        } else if (index === 1) {
            row.getCell('rank').value = '🥈 2';
        } else if (index === 2) {
            row.getCell('rank').value = '🥉 3';
        }

        // Highlight top 3 rows
        if (index < 3) {
            const fillColor = index === 0 ? 'FFFFEB3B' : index === 1 ? 'FFC0C0C0' : 'FFCD7F32';
            for (let i = 1; i <= 9; i++) {
                row.getCell(i).fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: fillColor }
                };
            }
        }
    });

    // Add summary section
    const summaryStartRow = topUsers.length + 3;
    worksheet.getCell(`A${summaryStartRow}`).value = 'SUMMARY';
    worksheet.getCell(`A${summaryStartRow}`).font = { bold: true, size: 12 };

    const totalRss = topUsers.reduce((sum, user) => sum + user.totalRss, 0);
    const avgRss = Math.floor(totalRss / topUsers.length);
    const maxRss = Math.max(...topUsers.map(u => u.totalRss));
    const minRss = Math.min(...topUsers.map(u => u.totalRss));

    worksheet.getCell(`A${summaryStartRow + 2}`).value = 'Total Users Ranked:';
    worksheet.getCell(`B${summaryStartRow + 2}`).value = topUsers.length;

    worksheet.getCell(`A${summaryStartRow + 3}`).value = 'Total RSS Collected:';
    worksheet.getCell(`B${summaryStartRow + 3}`).value = totalRss;
    worksheet.getCell(`B${summaryStartRow + 3}`).numFmt = '#,##0';

    worksheet.getCell(`A${summaryStartRow + 4}`).value = 'Average RSS per User:';
    worksheet.getCell(`B${summaryStartRow + 4}`).value = avgRss;
    worksheet.getCell(`B${summaryStartRow + 4}`).numFmt = '#,##0';

    worksheet.getCell(`A${summaryStartRow + 5}`).value = 'Highest Contributor:';
    worksheet.getCell(`B${summaryStartRow + 5}`).value = maxRss;
    worksheet.getCell(`B${summaryStartRow + 5}`).numFmt = '#,##0';

    worksheet.getCell(`A${summaryStartRow + 6}`).value = 'Lowest Contributor:';
    worksheet.getCell(`B${summaryStartRow + 6}`).value = minRss;
    worksheet.getCell(`B${summaryStartRow + 6}`).numFmt = '#,##0';

    // Add timestamp
    const timestamp = new Date().toISOString();
    worksheet.getCell(`A${summaryStartRow + 8}`).value = `Generated: ${timestamp}`;
    worksheet.getCell(`A${summaryStartRow + 8}`).font = { italic: true, size: 10 };

    // Create uploads directory if not exists
    const uploadsDir = path.join(__dirname, '../public/uploads');
    if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Generate filename with timestamp
    const filename = `bank-rank-report-${bankName.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}.xlsx`;
    const filepath = path.join(uploadsDir, filename);

    // Save workbook
    await workbook.xlsx.writeFile(filepath);

    return {
        filepath: filepath,
        filename: filename,
        url: `/uploads/${filename}`
    };
}

/**
 * Generate Excel report for detailed user contributions
 * @param {Object} user - User object
 * @param {Array} contributions - Array of contributions
 * @returns {Promise<String>} Path to the generated Excel file
 */
export async function generateUserDetailReport(user, contributions) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('User Contribution Report');

    // Row 1: Title
    worksheet.mergeCells('A1:G1');
    const titleCell = worksheet.getCell('A1');
    titleCell.value = `Contribution Report - ${user.name}`;
    titleCell.font = { bold: true, size: 16, color: { argb: 'FFFFFFFF' } };
    titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD700' } };
    titleCell.alignment = { horizontal: 'center', vertical: 'center' };
    titleCell.height = 25;

    // Row 3-5: User Info
    worksheet.getCell('A3').value = 'User ID:';
    worksheet.getCell('A3').font = { bold: true };
    worksheet.getCell('B3').value = user.id;

    worksheet.getCell('A4').value = 'Email:';
    worksheet.getCell('A4').font = { bold: true };
    worksheet.getCell('B4').value = user.email;

    worksheet.getCell('A5').value = 'Role:';
    worksheet.getCell('A5').font = { bold: true };
    worksheet.getCell('B5').value = user.role || 'Member';

    // Column widths
    worksheet.columns = [
        { width: 10 },
        { width: 15 },
        { width: 15 },
        { width: 15 },
        { width: 15 },
        { width: 15 },
        { width: 15 }
    ];

    // Row 7: Header
    const headerRow = worksheet.getRow(7);
    headerRow.values = ['Week', 'Date', 'Food', 'Wood', 'Stone', 'Gold', 'Total RSS'];
    headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    headerRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '1F4E78' } };
    headerRow.alignment = { horizontal: 'center', vertical: 'center' };

    // Data rows
    let totalFood = 0, totalWood = 0, totalStone = 0, totalGold = 0, totalRss = 0;
    let rowNum = 8;

    contributions.forEach((contrib, index) => {
        const food = parseInt(contrib.food) || 0;
        const wood = parseInt(contrib.wood) || 0;
        const stone = parseInt(contrib.stone) || 0;
        const gold = parseInt(contrib.gold) || 0;
        const total = parseInt(contrib.total_rss) || 0;

        totalFood += food;
        totalWood += wood;
        totalStone += stone;
        totalGold += gold;
        totalRss += total;

        const row = worksheet.getRow(rowNum);
        row.values = [
            contrib.week || index + 1,
            contrib.date || 'N/A',
            food,
            wood,
            stone,
            gold,
            total
        ];

        // Format numbers
        row.getCell(3).numFmt = '#,##0';
        row.getCell(4).numFmt = '#,##0';
        row.getCell(5).numFmt = '#,##0';
        row.getCell(6).numFmt = '#,##0';
        row.getCell(7).numFmt = '#,##0';
        row.alignment = { horizontal: 'right', vertical: 'center' };

        rowNum++;
    });

    // Total row
    const totalRowNum = rowNum + 1;
    const totalRow = worksheet.getRow(totalRowNum);
    totalRow.values = ['TOTAL', '', totalFood, totalWood, totalStone, totalGold, totalRss];
    totalRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    totalRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '70AD47' } };
    totalRow.getCell(3).numFmt = '#,##0';
    totalRow.getCell(4).numFmt = '#,##0';
    totalRow.getCell(5).numFmt = '#,##0';
    totalRow.getCell(6).numFmt = '#,##0';
    totalRow.getCell(7).numFmt = '#,##0';

    // Summary section
    const summaryRowStart = totalRowNum + 3;
    worksheet.getCell(`A${summaryRowStart}`).value = 'SUMMARY';
    worksheet.getCell(`A${summaryRowStart}`).font = { bold: true, size: 12 };

    worksheet.getCell(`A${summaryRowStart + 2}`).value = 'Total Weeks:';
    worksheet.getCell(`A${summaryRowStart + 2}`).font = { bold: true };
    worksheet.getCell(`B${summaryRowStart + 2}`).value = contributions.length;

    worksheet.getCell(`A${summaryRowStart + 3}`).value = 'Total RSS:';
    worksheet.getCell(`A${summaryRowStart + 3}`).font = { bold: true };
    worksheet.getCell(`B${summaryRowStart + 3}`).value = totalRss;
    worksheet.getCell(`B${summaryRowStart + 3}`).numFmt = '#,##0';

    worksheet.getCell(`A${summaryRowStart + 4}`).value = 'Average/Week:';
    worksheet.getCell(`A${summaryRowStart + 4}`).font = { bold: true };
    const avgPerWeek = contributions.length > 0 ? Math.floor(totalRss / contributions.length) : 0;
    worksheet.getCell(`B${summaryRowStart + 4}`).value = avgPerWeek;
    worksheet.getCell(`B${summaryRowStart + 4}`).numFmt = '#,##0';

    // Create uploads directory if not exists
    const uploadsDir = path.join(__dirname, '../public/uploads');
    if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Generate filename
    const filename = `user-report-${user.name.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}.xlsx`;
    const filepath = path.join(uploadsDir, filename);

    // Save workbook
    await workbook.xlsx.writeFile(filepath);

    return {
        filepath: filepath,
        filename: filename,
        url: `/uploads/${filename}`
    };
}

/**
 * Generate Excel report for Alliance Bank (all members in alliance)
 * @param {Object} alliance - Alliance object
 * @param {Array} members - Array of members with their contributions
 * @returns {Promise<Object>} File info object
 */
export async function generateAllianceReport(alliance, members) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Alliance Bank Report');

    // Row 1: Title
    worksheet.mergeCells('A1:I1');
    const titleCell = worksheet.getCell('A1');
    titleCell.value = `Bank Report - ${alliance.bank_name || alliance.name}`;
    titleCell.font = { bold: true, size: 16, color: { argb: 'FFFFFFFF' } };
    titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD700' } };
    titleCell.alignment = { horizontal: 'center', vertical: 'center' };

    // Row 3: Alliance Info
    worksheet.getCell('A3').value = 'Alliance Tag:';
    worksheet.getCell('A3').font = { bold: true };
    worksheet.getCell('B3').value = alliance.tag || 'N/A';

    worksheet.getCell('A4').value = 'Generated:';
    worksheet.getCell('A4').font = { bold: true };
    worksheet.getCell('B4').value = new Date().toLocaleString();

    // Set column widths
    worksheet.columns = [
        { header: 'Rank', key: 'rank', width: 8 },
        { header: 'Member Name', key: 'name', width: 25 },
        { header: 'Food', key: 'food', width: 15 },
        { header: 'Wood', key: 'wood', width: 15 },
        { header: 'Stone', key: 'stone', width: 15 },
        { header: 'Gold', key: 'gold', width: 15 },
        { header: 'Total RSS', key: 'totalRss', width: 15 },
        { header: 'Weeks', key: 'weeks', width: 10 },
        { header: 'Avg/Week', key: 'avgPerWeek', width: 15 }
    ];

    // Row 6: Header - Set values explicitly
    const headerRow = worksheet.getRow(6);
    headerRow.values = ['Rank', 'Member Name', 'Food', 'Wood', 'Stone', 'Gold', 'Total RSS', 'Weeks', 'Avg/Week'];
    headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    headerRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '1F4E78' } };
    headerRow.alignment = { horizontal: 'center', vertical: 'center' };

    // Add data rows
    let rowNum = 7;
    members.forEach((member, index) => {
        const row = worksheet.addRow({
            rank: index + 1,
            name: member.name,
            food: member.food || 0,
            wood: member.wood || 0,
            stone: member.stone || 0,
            gold: member.gold || 0,
            totalRss: member.totalRss || 0,
            weeks: member.totalWeeks || 0,
            avgPerWeek: member.avgPerWeek || 0
        });

        // Format numbers
        row.getCell('food').numFmt = '#,##0';
        row.getCell('wood').numFmt = '#,##0';
        row.getCell('stone').numFmt = '#,##0';
        row.getCell('gold').numFmt = '#,##0';
        row.getCell('totalRss').numFmt = '#,##0';
        row.getCell('avgPerWeek').numFmt = '#,##0';
        row.alignment = { horizontal: 'right', vertical: 'center' };

        // Add medal emoji for top 3
        if (index === 0) {
            row.getCell('rank').value = '🥇 1';
        } else if (index === 1) {
            row.getCell('rank').value = '🥈 2';
        } else if (index === 2) {
            row.getCell('rank').value = '🥉 3';
        }

        // Highlight top 3
        if (index < 3) {
            const fillColor = index === 0 ? 'FFFFEB3B' : index === 1 ? 'FFC0C0C0' : 'FFCD7F32';
            for (let col = 1; col <= 9; col++) {
                row.getCell(col).fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: fillColor }
                };
            }
        }

        rowNum++;
    });

    // Summary section
    const summaryStartRow = rowNum + 2;
    worksheet.getCell(`A${summaryStartRow}`).value = 'SUMMARY';
    worksheet.getCell(`A${summaryStartRow}`).font = { bold: true, size: 12 };

    const totalRss = members.reduce((sum, m) => sum + (m.totalRss || 0), 0);
    const totalFood = members.reduce((sum, m) => sum + (m.food || 0), 0);
    const totalWood = members.reduce((sum, m) => sum + (m.wood || 0), 0);
    const totalStone = members.reduce((sum, m) => sum + (m.stone || 0), 0);
    const totalGold = members.reduce((sum, m) => sum + (m.gold || 0), 0);

    worksheet.getCell(`A${summaryStartRow + 2}`).value = 'Total Members:';
    worksheet.getCell(`A${summaryStartRow + 2}`).font = { bold: true };
    worksheet.getCell(`B${summaryStartRow + 2}`).value = members.length;

    worksheet.getCell(`A${summaryStartRow + 3}`).value = 'Total Food:';
    worksheet.getCell(`B${summaryStartRow + 3}`).value = totalFood;
    worksheet.getCell(`B${summaryStartRow + 3}`).numFmt = '#,##0';

    worksheet.getCell(`A${summaryStartRow + 4}`).value = 'Total Wood:';
    worksheet.getCell(`B${summaryStartRow + 4}`).value = totalWood;
    worksheet.getCell(`B${summaryStartRow + 4}`).numFmt = '#,##0';

    worksheet.getCell(`A${summaryStartRow + 5}`).value = 'Total Stone:';
    worksheet.getCell(`B${summaryStartRow + 5}`).value = totalStone;
    worksheet.getCell(`B${summaryStartRow + 5}`).numFmt = '#,##0';

    worksheet.getCell(`A${summaryStartRow + 6}`).value = 'Total Gold:';
    worksheet.getCell(`B${summaryStartRow + 6}`).value = totalGold;
    worksheet.getCell(`B${summaryStartRow + 6}`).numFmt = '#,##0';

    worksheet.getCell(`A${summaryStartRow + 7}`).value = 'Total RSS:';
    worksheet.getCell(`A${summaryStartRow + 7}`).font = { bold: true };
    worksheet.getCell(`B${summaryStartRow + 7}`).value = totalRss;
    worksheet.getCell(`B${summaryStartRow + 7}`).numFmt = '#,##0';
    worksheet.getCell(`B${summaryStartRow + 7}`).font = { bold: true };

    // Create uploads directory if not exists
    const uploadsDir = path.join(__dirname, '../public/uploads');
    if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Generate filename
    const bankName = (alliance.bank_name || alliance.name).replace(/\s+/g, '-').toLowerCase();
    const filename = `alliance-report-${bankName}-${Date.now()}.xlsx`;
    const filepath = path.join(uploadsDir, filename);

    // Save workbook
    await workbook.xlsx.writeFile(filepath);

    return {
        filepath: filepath,
        filename: filename,
        url: `/uploads/${filename}`
    };
}
