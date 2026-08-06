import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer';
import type { Wochenbericht, AppProfile } from '../../types/report';
import { formatDateGerman } from '../../utils/dateUtils';

// Register standard fonts
Font.register({
  family: 'Helvetica',
  fonts: [
    { src: 'https://cdn.jsdelivr.net/npm/@canvas-fonts/helvetica@1.0.4/Helvetica.ttf' },
    { src: 'https://cdn.jsdelivr.net/npm/@canvas-fonts/helvetica-bold@1.0.4/Helvetica-Bold.ttf', fontWeight: 'bold' }
  ]
});

const styles = StyleSheet.create({
  page: {
    padding: 28,
    fontSize: 9,
    fontFamily: 'Helvetica',
    color: '#1e293b',
    backgroundColor: '#ffffff'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#f59e0b',
    paddingBottom: 8,
    marginBottom: 10
  },
  titleContainer: {
    flexDirection: 'column'
  },
  mainTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0f172a'
  },
  subTitle: {
    fontSize: 9,
    color: '#64748b',
    marginTop: 2
  },
  ihkBadge: {
    fontSize: 8,
    fontWeight: 'bold',
    backgroundColor: '#fef3c7',
    color: '#b45309',
    padding: '4 8',
    borderRadius: 4
  },
  metaGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 4,
    padding: 8,
    marginBottom: 10
  },
  metaCol: {
    flexDirection: 'column',
    width: '48%'
  },
  metaRow: {
    flexDirection: 'row',
    marginBottom: 3
  },
  metaLabel: {
    width: 100,
    fontWeight: 'bold',
    color: '#475569'
  },
  metaVal: {
    color: '#0f172a'
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    backgroundColor: '#0f172a',
    color: '#ffffff',
    padding: '4 8',
    borderRadius: 2,
    marginBottom: 6,
    marginTop: 4
  },
  table: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 2,
    marginBottom: 10
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f1f5f9',
    borderBottomWidth: 1,
    borderBottomColor: '#cbd5e1',
    padding: 4,
    fontWeight: 'bold'
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    padding: 4,
    minHeight: 18
  },
  colDay: { width: '22%' },
  colSubject: { width: '63%' },
  colHours: { width: '15%', textAlign: 'right' },
  colCompanyDesc: { width: '63%' },

  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fffbeb',
    borderWidth: 1,
    borderColor: '#fde68a',
    padding: 6,
    borderRadius: 4,
    marginBottom: 12
  },
  summaryText: {
    fontWeight: 'bold',
    color: '#b45309'
  },
  signatureSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#cbd5e1'
  },
  sigBox: {
    width: '48%',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 4,
    padding: 6,
    height: 75,
    justifyContent: 'space-between'
  },
  sigTitle: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#475569',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    paddingBottom: 2
  },
  sigImage: {
    height: 32,
    objectFit: 'contain'
  },
  sigFooter: {
    fontSize: 7,
    color: '#94a3b8',
    flexDirection: 'row',
    justifyContent: 'space-between'
  }
});

interface IhkReportPdfTemplateProps {
  report: Wochenbericht;
  profile?: AppProfile;
}

export const IhkReportPdfTemplate: React.FC<IhkReportPdfTemplateProps> = ({ report, profile }) => {
  const wType = report.wochenTyp || 'BETRIEB';
  const hasSchool = wType === 'SCHULE' || wType === 'SCHULE_BETRIEB';
  const hasCompany = wType === 'BETRIEB' || wType === 'SCHULE_BETRIEB' || wType === 'URLAUB' || wType === 'KRANK';

  const formatTypeLabel = (t: string) => {
    switch (t) {
      case 'BETRIEB':
        return 'Betriebswoche';
      case 'SCHULE':
        return 'Berufsschulwoche (Rein)';
      case 'SCHULE_BETRIEB':
        return 'Berufsschulwoche + Betrieb';
      case 'URLAUB':
        return 'Urlaubswoche';
      case 'KRANK':
        return 'Krankheitswoche';
      default:
        return 'Betriebswoche';
    }
  };

  return (
    <Document title={`IHK_Berichtsheft_KW${report.kalenderwoche}_${report.jahr}`}>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={styles.mainTitle}>Ausbildungsnachweis (Wochenbericht)</Text>
            <Text style={styles.subTitle}>
              Ausbildungsberuf: Fachkraft Küche (§ 13 & § 14 BBiG) — Modus: {formatTypeLabel(wType)}
            </Text>
          </View>
          <Text style={styles.ihkBadge}>
            KW {report.kalenderwoche} / {report.jahr} ({report.ausbildungsjahr}. Jahr)
          </Text>
        </View>

        {/* Profile Meta Grid */}
        <View style={styles.metaGrid}>
          <View style={styles.metaCol}>
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Auszubildende/r:</Text>
              <Text style={styles.metaVal}>{profile?.traineeName || 'David Grabowski'}</Text>
            </View>
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Ausbildungsbetrieb:</Text>
              <Text style={styles.metaVal}>{profile?.companyName || 'Romantikhotel zum Lindengarten'}</Text>
            </View>
          </View>

          <View style={styles.metaCol}>
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Ausbilder/in:</Text>
              <Text style={styles.metaVal}>{profile?.trainerName || 'Birgit Witt'}</Text>
            </View>
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Berichtszeitraum:</Text>
              <Text style={styles.metaVal}>
                {formatDateGerman(report.startDate)} – {formatDateGerman(report.endDate)}
              </Text>
            </View>
          </View>
        </View>

        {/* Section 1: Berufsschulunterricht (Rendered if SCHULE or SCHULE_BETRIEB) */}
        {hasSchool && (
          <>
            <Text style={styles.sectionTitle}>I. Berufsschulunterricht</Text>
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <Text style={styles.colDay}>Tag / Fach</Text>
                <Text style={styles.colSubject}>Unterrichtsinhalt & behandelte Themen</Text>
                <Text style={styles.colHours}>Stunden</Text>
              </View>

              {report.berufsschulTage.map((day, idx) => (
                <View key={idx} style={styles.tableRow}>
                  <Text style={styles.colDay}>
                    {day.dayOfWeek} {day.fach ? `(${day.fach})` : ''}
                  </Text>
                  <Text style={styles.colSubject}>{day.thema || 'Unterricht'}</Text>
                  <Text style={styles.colHours}>{day.stunden} Std.</Text>
                </View>
              ))}
            </View>
          </>
        )}

        {/* Section 2: Betriebliche Tätigkeiten (Rendered if BETRIEB, SCHULE_BETRIEB, URLAUB, KRANK) */}
        {hasCompany && (
          <>
            <Text style={styles.sectionTitle}>
              {hasSchool ? 'II. Betriebliche Tätigkeiten / Praxiseinsatz' : 'I. Betriebliche Tätigkeiten & Wochenbericht'}
            </Text>
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <Text style={styles.colDay}>Zeitraumeintrag</Text>
                <Text style={styles.colCompanyDesc}>Ausgeführte Arbeiten & Unterweisungen im Betrieb</Text>
                <Text style={styles.colHours}>Stunden</Text>
              </View>

              {report.betrieblicheTaetigkeiten.map((act, idx) => (
                <View key={idx} style={styles.tableRow}>
                  <Text style={styles.colDay}>{act.dayOfWeek}</Text>
                  <Text style={styles.colCompanyDesc}>{act.beschreibung || 'Küchenarbeit'}</Text>
                  <Text style={styles.colHours}>{act.stunden} Std.</Text>
                </View>
              ))}
            </View>
          </>
        )}

        {/* Hours Summary */}
        <View style={styles.summaryRow}>
          <Text style={styles.summaryText}>
            Schulstunden: {report.schultageStunden || 0} Std. | Betriebsstunden: {report.betriebStunden || 0} Std.
          </Text>
          <Text style={styles.summaryText}>
            Gesamtstunden Woche: {report.gesamtStunden || 40} Std.
          </Text>
        </View>

        {/* Signatures Footer */}
        <View style={styles.signatureSection}>
          {/* Trainee Signature */}
          <View style={styles.sigBox}>
            <Text style={styles.sigTitle}>Unterschrift Auszubildende/r:</Text>
            {report.traineeSignature?.signatureDataUrl ? (
              <Image style={styles.sigImage} src={report.traineeSignature.signatureDataUrl} />
            ) : (
              <Text style={{ color: '#94a3b8', fontStyle: 'italic', marginVertical: 8 }}>
                (Elektronisch eingereicht)
              </Text>
            )}
            <View style={styles.sigFooter}>
              <Text>{report.traineeSignature?.signedBy || profile?.traineeName || 'David Grabowski'}</Text>
              <Text>
                {report.traineeSignature?.timestamp
                  ? formatDateGerman(report.traineeSignature.timestamp.split('T')[0])
                  : ''}
              </Text>
            </View>
          </View>

          {/* Trainer Signature */}
          <View style={styles.sigBox}>
            <Text style={styles.sigTitle}>Unterschrift Ausbilder/in (IHK Freigabe):</Text>
            {report.trainerSignature?.signatureDataUrl ? (
              <Image style={styles.sigImage} src={report.trainerSignature.signatureDataUrl} />
            ) : (
              <Text style={{ color: '#94a3b8', fontStyle: 'italic', marginVertical: 8 }}>
                {report.status === 'APPROVED' ? 'Digital Abgezeichnet' : 'Ausstehend'}
              </Text>
            )}
            <View style={styles.sigFooter}>
              <Text>{report.trainerSignature?.signedBy || profile?.trainerName || 'Birgit Witt'}</Text>
              <Text>
                {report.trainerSignature?.timestamp
                  ? formatDateGerman(report.trainerSignature.timestamp.split('T')[0])
                  : ''}
              </Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};
