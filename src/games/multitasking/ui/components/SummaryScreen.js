import React from 'react';
import { saveAs } from 'file-saver';
import { makePdfBlob } from '../../GenerateReport';
import { Link } from 'react-router-dom';

const SummaryScreen = ({
                           selectedLanguage,
                           selectedColorScheme,
                           score,
                           step,
                           reactionTimes,
                           cursorCells,
                           correctSides,
                           selectedSides,
                           finishedDate,
                           state,
                           resetTest,
                       }) => {
    /* ===== Helpers ===== */
    const totalTime = reactionTimes.reduce((sum, t) => sum + t, 0);
    const avgRT = totalTime / reactionTimes.length;

    const cellLabel = c =>
        c === 1
            ? selectedLanguage.left
            : c === 2
                ? selectedLanguage.middle
                : selectedLanguage.right;

    const sideLabel = s =>
        s === 'left' ? selectedLanguage.left : s === 'right' ? selectedLanguage.right : selectedLanguage.middle;

    const tableRows = cursorCells.map((cell, i) => ({
        nr: i + 1,
        cell: cellLabel(cell),
        select: sideLabel(selectedSides[i]),
        correct: sideLabel(correctSides[i]),
        rt: `${reactionTimes[i]} ms`,
    }));

    const headers = {
        nr: selectedLanguage.numberQuestion,
        cell: selectedLanguage.cell,
        select: selectedLanguage.selectedAnswer,
        correct: selectedLanguage.correctAnswer,
        rt: `${selectedLanguage.reactionTime} (ms)`,
    };

    /* ===== Styles ===== */
    const outer = {
        width: '100vw',
        minHeight: '100vh',
        backgroundColor: selectedColorScheme.backgroundColor,
        color: selectedColorScheme.textColor,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '2rem',
    };

    const card = {
        backgroundColor: selectedColorScheme.summaryBackgroundColor,
        borderRadius: 20,
        padding: '2rem 3rem',
        maxWidth: 600,
        width: '90%',
        boxShadow: '0 4px 8px rgba(0,0,0,.15)',
    };

    const statTable = {
        width: '100%',
        borderCollapse: 'collapse',
        fontSize: '1.4rem',
    };

    const th = { textAlign: 'left', padding: '0.3rem 0' };
    const td = { textAlign: 'right', fontWeight: 700 };

    const detailWrap = {
        maxHeight: 260,
        overflowY: 'auto',
        marginTop: 16,
        border: `1px solid ${selectedColorScheme.textColor}33`,
        borderRadius: 12,
    };

    const detailTable = {
        width: '100%',
        borderCollapse: 'collapse',
        fontSize: '1rem',
    };

    const zebra = i => ({ backgroundColor: i % 2 ? 'transparent' : `${selectedColorScheme.textColor}0D` });

    return (
        <div style={outer}>
            <Link
                to="/settings"
                className="settings-icon"
                style={{ position: 'absolute', top: '1rem', right: '1rem' }}
            >
                ⚙
            </Link>

            <h1 style={{ color: selectedColorScheme.titleColor }}>{selectedLanguage.summary}</h1>

            {/* Stats */}
            <div style={card}>
                <table style={statTable}>
                    <tbody>
                    <tr>
                        <th style={th}>{selectedLanguage.rightAnswers}:</th>
                        <td style={td}>
                            {score} / {step}
                        </td>
                    </tr>
                    <tr>
                        <th style={th}>{selectedLanguage.totalTime}:</th>
                        <td style={td}>{(totalTime / 1000).toFixed(2)} s</td>
                    </tr>
                    <tr>
                        <th style={th}>{selectedLanguage.averageReactionTime}:</th>
                        <td style={td}>{avgRT.toFixed(0)} ms</td>
                    </tr>
                    </tbody>
                </table>
            </div>

            {/* Details */}
            <h2 style={{ marginTop: '2rem', color: selectedColorScheme.titleColor }}>
                {selectedLanguage.detailedResults}
            </h2>

            <div style={detailWrap}>
                <table style={detailTable}>
                    <thead>
                    <tr>
                        <th style={{ padding: '0.4rem 0.6rem', textAlign: 'left' }}>{selectedLanguage.numberQuestion}</th>
                        <th style={{ padding: '0.4rem 0.6rem', textAlign: 'left' }}>{selectedLanguage.cell}</th>
                        <th style={{ padding: '0.4rem 0.6rem', textAlign: 'left' }}>{selectedLanguage.selectedAnswer}</th>
                        <th style={{ padding: '0.4rem 0.6rem', textAlign: 'left' }}>{selectedLanguage.correctAnswer}</th>
                        <th style={{ padding: '0.4rem 0.6rem', textAlign: 'left' }}>
                            {selectedLanguage.reactionTime} (ms)
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {cursorCells.map((cell, i) => (
                        <tr key={i} style={zebra(i)}>
                            <td>{i + 1}</td>
                            <td>{cellLabel(cell)}</td>
                            <td>{sideLabel(selectedSides[i])}</td>
                            <td>{sideLabel(correctSides[i])}</td>
                            <td>{reactionTimes[i]}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* Buttons */}
            <button
                style={{
                    backgroundColor: selectedColorScheme.buttonBackground,
                    color: selectedColorScheme.buttonTextColor,
                    width: '15rem',
                    height: '5rem',
                    borderRadius: '20px',
                    fontSize: '1.2rem',
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                    border: 'none',
                    marginTop: '2rem',
                    cursor: 'pointer',
                }}
                onClick={async () => {
                    try {
                        const timestamp = finishedDate.getTime();
                        const blob = await makePdfBlob({
                            headers,
                            rows: tableRows,
                            title: `${selectedLanguage.report} ${state.player.name}: ${finishedDate.toLocaleDateString()}`,
                        });
                        saveAs(blob, `report_${state.player.name}_${timestamp}.pdf`);
                    } catch (e) {
                        console.error('PDF error', e);
                    }
                }}
            >
                ⬇️ {selectedLanguage.downloadPdf}
            </button>

            <button
                style={{
                    backgroundColor: selectedColorScheme.buttonBackground,
                    color: selectedColorScheme.buttonTextColor,
                    width: '15rem',
                    height: '5rem',
                    borderRadius: '20px',
                    fontSize: '1.2rem',
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                    border: 'none',
                    marginTop: '2.5rem',
                    cursor: 'pointer',
                }}
                onClick={resetTest}
            >
                {selectedLanguage.return}
            </button>
        </div>
    );
};

export default SummaryScreen;