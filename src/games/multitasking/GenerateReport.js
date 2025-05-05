import {
    pdf, Page, Text, View, Document, StyleSheet,
} from '@react-pdf/renderer';
import '../../fonts/fonts';

const styles = StyleSheet.create({
    page: {padding: 24, fontFamily: 'Inter'},

    surveyLabel: {fontSize: 12, marginBottom: 2},
    surveyValue: {fontSize: 12, fontWeight: 'bold', marginBottom: 4},

    row: {
        flexDirection: 'row',
        borderBottom: 1,
        paddingVertical: 4,
        alignItems: 'center',
    },
    colNr: {width: 32},
    colCell: {flexGrow: 1, minWidth: 140},
    colSelect: {width: 90, textAlign: 'center'},
    colCorrect: {width: 90, textAlign: 'center'},
    colRt: {width: 72, textAlign: 'right'},

    headerTxt: {fontSize: 10, fontWeight: 'bold', lineHeight: 1.15},
    cellTxt: {fontSize: 10, lineHeight: 1.15},
    summaryCard: {
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: '#777',
        borderRadius: 8,
        padding: 10,
        marginBottom: 16,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        fontSize: 12,
        color: '#000000',
        marginBottom: 4,
    },
});


export const makePdfBlob = async ({
                                      headers,
                                      rows,
                                      title = 'Unknown report',
                                      survey = {},
                                      selectedLanguage,
                                      summary
                                  }) => {
    const {
        isFilled,
        age,
        gender,
        device,
        additionalInfo,
        takenBefore,
        frequency,
    } = survey;

    const doc = (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* ─────────── Title ─────────── */}
                <Text style={{fontSize: 20, marginBottom: 16}}>{title}</Text>

                {/* ───── Summary card ───── */}
                <View style={styles.summaryCard}>
                    <View style={styles.summaryRow}>
                        <Text>{selectedLanguage.rightAnswers}:</Text>
                        <Text>{summary.rightAnswers}</Text>
                    </View>
                    <View style={styles.summaryRow}>
                        <Text>{selectedLanguage.totalTime}:</Text>
                        <Text>{summary.totalTime}</Text>
                    </View>
                    <View style={styles.summaryRow}>
                        <Text>{selectedLanguage.averageReactionTime}:</Text>
                        <Text>{summary.avgRT}</Text>
                    </View>
                </View>

                {/* ─────────── Survey ─────────── */}
                {isFilled ? (
                    <View style={{marginBottom: 16}}>
                        <Text style={styles.surveyLabel}>{selectedLanguage.age}: <Text
                            style={styles.surveyValue}>{age ?? '—'}</Text></Text>
                        <Text style={styles.surveyLabel}>{selectedLanguage.gender}: <Text
                            style={styles.surveyValue}>{gender ?? '—'}</Text></Text>
                        <Text style={styles.surveyLabel}>{selectedLanguage.device}: <Text
                            style={styles.surveyValue}>{device ?? '—'}</Text></Text>
                        <Text style={styles.surveyLabel}>{selectedLanguage.frequency}: <Text
                            style={styles.surveyValue}>{frequency ?? '—'}</Text></Text>
                        {additionalInfo && (
                            <Text style={styles.surveyLabel}>
                                {selectedLanguage.additionalInfo}: <Text
                                style={styles.surveyValue}>{additionalInfo}</Text>
                            </Text>
                        )}
                        <Text style={styles.surveyLabel}>
                            {selectedLanguage.takenBefore}: <Text style={styles.surveyValue}>{takenBefore ?? '—'}</Text>
                        </Text>
                    </View>
                ) : (
                    <Text style={{fontSize: 12, marginBottom: 16, fontWeight: 'bold'}}>
                        {selectedLanguage.surveyMissing}
                    </Text>
                )}

                {/* ─────────── Table headers ─────────── */}
                <View style={styles.row}>
                    <Text style={[styles.colNr, styles.headerTxt]}>{headers.nr}</Text>
                    <Text style={[styles.colCell, styles.headerTxt]}>{headers.cell}</Text>
                    <Text style={[styles.colSelect, styles.headerTxt]}>{headers.select}</Text>
                    <Text style={[styles.colCorrect, styles.headerTxt]}>{headers.correct}</Text>
                    <Text style={[styles.colRt, styles.headerTxt]}>{headers.rt}</Text>
                </View>

                {/* ─────────── Rows ─────────── */}
                {rows.map(r => (
                    <View key={r.nr} style={styles.row}>
                        <Text style={[styles.colNr, styles.cellTxt]}>{r.nr}</Text>
                        <Text style={[styles.colCell, styles.cellTxt]}>{r.cell}</Text>
                        <Text style={[styles.colSelect, styles.cellTxt]}>{r.select}</Text>
                        <Text style={[styles.colCorrect, styles.cellTxt]}>{r.correct}</Text>
                        <Text style={[styles.colRt, styles.cellTxt]}>{r.rt}</Text>
                    </View>
                ))}
            </Page>
        </Document>
    );

    return pdf(doc).toBlob();
};
