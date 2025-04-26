// GenerateReport.js  ───────────────────────────────
import { pdf, Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    page: { padding: 24, fontFamily: 'Helvetica' },

    row: {
        flexDirection: 'row',
        borderBottom: 1,
        paddingVertical: 4,
        alignItems: 'center',
    },

    /*        nr |  cell     | selected | correct  |   RT   */
    colNr:      { width: 32 },
    colCell:    { flexGrow: 1, minWidth: 140 },
    colSelect:  { width: 90,  textAlign: 'center' },
    colCorrect: { width: 90,  textAlign: 'center' },
    colRt:      { width: 72,  textAlign: 'right' },

    headerTxt: { fontSize: 10, fontWeight: 'bold', lineHeight: 1.15 },
    cellTxt:   { fontSize: 10, lineHeight: 1.15 },
});


export const makePdfBlob = async ({ headers, rows, title = 'Unknown report' }) => {
    const doc = (
        <Document>
            <Page size="A4" style={styles.page}>
                <Text style={{ fontSize: 20, marginBottom: 16 }}>{title}</Text>

                {/* Nagłówek */}
                <View style={styles.row}>
                    <Text style={[styles.colNr,     styles.headerTxt]}>{headers.nr}</Text>
                    <Text style={[styles.colCell,   styles.headerTxt]}>{headers.cell}</Text>
                    <Text style={[styles.colSelect, styles.headerTxt]}>{headers.select}</Text>
                    <Text style={[styles.colCorrect,styles.headerTxt]}>{headers.correct}</Text>
                    <Text style={[styles.colRt,     styles.headerTxt]}>{headers.rt}</Text>
                </View>

                {/* Wiersze */}
                {rows.map(r => (
                    <View key={r.nr} style={styles.row}>
                        <Text style={[styles.colNr,     styles.cellTxt]}>{r.nr}</Text>
                        <Text style={[styles.colCell,   styles.cellTxt]}>{r.cell}</Text>
                        <Text style={[styles.colSelect, styles.cellTxt]}>{r.select}</Text>
                        <Text style={[styles.colCorrect,styles.cellTxt]}>{r.correct}</Text>
                        <Text style={[styles.colRt,     styles.cellTxt]}>{r.rt}</Text>
                    </View>
                ))}
            </Page>
        </Document>
    );

    return pdf(doc).toBlob();
};
