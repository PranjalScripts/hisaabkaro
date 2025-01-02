import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';

// Register fonts with different weights
Font.register({
  family: 'Roboto',
  fonts: [
    {
      src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf',
      fontWeight: 'normal'
    },
    {
      src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf',
      fontWeight: 'bold'
    },
    {
      src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-black-webfont.ttf',
      fontWeight: 'heavy'
    }
  ]
});

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Roboto',
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 20,
    paddingBottom: 80,
  },
  headerContainer: {
    marginBottom: 30,
    flexDirection: 'row',
    gap: 15,
  },
  headerSection: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
  },
  bookNameSection: {
    backgroundColor: '#EBF5FF',
  },
  mobileSection: {
    backgroundColor: '#FDF2F8',
  },
  clientSection: {
    backgroundColor: '#F3E8FF',
  },
  balanceSection: {
    backgroundColor: '#ECFDF5',
  },
  headerLabel: {
    fontSize: 9,
    color: '#111827',
    marginBottom: 4,
    textTransform: 'uppercase',
    fontWeight: 'heavy',
    fontFamily: 'Roboto',
  },
  headerValue: {
    fontSize: 11,
    color: '#000000',
    fontWeight: 'normal',
    fontFamily: 'Roboto',
  },
  balanceValue: {
    fontSize: 15,
    fontWeight: 'heavy',
    color: '#000000',
    fontFamily: 'Roboto',
  },
  redText: {
    color: '#DC2626',
  },
  greenText: {
    color: '#059669',
  },
  divider: {
    width: 1,
    backgroundColor: '#E5E7EB',
    alignSelf: 'stretch',
    margin: '0 10px',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 10,
    borderBottom: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  headerInfo: {
    flexDirection: 'row',
    gap: 20,
  },
  headerDetail: {
    fontSize: 12,
    color: '#4B5563',
  },
  headerBalance: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  table: {
    display: 'table',
    width: 'auto',
    marginTop: 10,
    borderStyle: 'solid',
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderColor: '#E5E7EB', // border-gray-200
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    minHeight: 35,
    alignItems: 'center',
  },
  tableHeader: {
    backgroundColor: '#F9FAFB', // bg-gray-50
  },
  tableHeaderCell: {
    fontSize: 11,
    fontWeight: 'heavy',
    color: '#111827',
    textTransform: 'uppercase',
    padding: 8,
    borderRightWidth: 1,
    borderRightColor: '#E5E7EB',
    fontFamily: 'Roboto',
  },
  tableCell: {
    fontSize: 10,
    color: '#111827',
    padding: 8,
    borderRightWidth: 1,
    borderRightColor: '#E5E7EB',
  },
  srNoCell: {
    width: '8%',
  },
  dateCell: {
    width: '15%',
  },
  amountCell: {
    width: '15%',
    textAlign: 'right',
  },
  descriptionCell: {
    width: '32%',
  },
  balanceCell: {
    width: '15%',
    textAlign: 'right',
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#1E40AF', // Deep blue background
    padding: 20,
    borderRadius: 8,
  },
  footerContent: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 12,
  },
  footerTop: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  footerLogo: {
    fontSize: 20,
    color: '#FFFFFF',
    fontFamily: 'Roboto',
    fontWeight: 'heavy',
  },
  footerDivider: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#FFFFFF',
    margin: '0 8px',
  },
  footerTagline: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Roboto',
    fontWeight: 'normal',
  },
  footerLink: {
    color: '#FFFFFF',
    fontSize: 14,
    textDecoration: 'underline',
    fontFamily: 'Roboto',
    fontWeight: 'bold',
  },
  footerMiddle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  footerTimestamp: {
    color: '#E5E7EB',
    fontSize: 12,
    fontFamily: 'Roboto',
    fontWeight: 'normal',
  },
  footerCopyright: {
    color: '#E5E7EB',
    fontSize: 12,
    fontFamily: 'Roboto',
    fontWeight: 'normal',
  },
});

const TransactionPDF = ({ transactions, bookName, clientName, outstandingBalance }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.headerContainer}>
        <View style={[styles.headerSection, styles.bookNameSection]}>
          <Text style={styles.headerLabel}>Book Name</Text>
          <Text style={styles.headerValue}>{bookName}</Text>
        </View>
        <View style={[styles.headerSection, styles.mobileSection]}>
          <Text style={styles.headerLabel}>Mobile</Text>
          <Text style={styles.headerValue}>{clientName?.mobile || 'N/A'}</Text>
        </View>
        <View style={[styles.headerSection, styles.clientSection]}>
          <Text style={styles.headerLabel}>Client</Text>
          <Text style={styles.headerValue}>{clientName?.name || 'N/A'}</Text>
        </View>
        <View style={[styles.headerSection, outstandingBalance < 0 ? { backgroundColor: '#FEE2E2' } : styles.balanceSection]}>
          <Text style={styles.headerLabel}>Balance</Text>
          <Text style={[
            styles.balanceValue,
            outstandingBalance < 0 ? styles.redText : styles.greenText
          ]}>
            {Math.abs(outstandingBalance).toLocaleString('en-IN')}
          </Text>
        </View>
      </View>
      
      <View style={styles.table}>
        <View style={[styles.tableRow, styles.tableHeader]}>
          <View style={[styles.tableHeaderCell, styles.srNoCell]}>
            <Text>Sr No</Text>
          </View>
          <View style={[styles.tableHeaderCell, styles.dateCell]}>
            <Text>Date</Text>
          </View>
          <View style={[styles.tableHeaderCell, styles.amountCell]}>
            <Text>You Will Give</Text>
          </View>
          <View style={[styles.tableHeaderCell, styles.amountCell]}>
            <Text>You Will Get</Text>
          </View>
          <View style={[styles.tableHeaderCell, styles.descriptionCell]}>
            <Text>Description</Text>
          </View>
          <View style={[styles.tableHeaderCell, styles.balanceCell]}>
            <Text>Balance</Text>
          </View>
        </View>

        {transactions.map((entry, index) => (
          <View key={index} style={styles.tableRow}>
            <View style={[styles.tableCell, styles.srNoCell]}>
              <Text>{index + 1}</Text>
            </View>
            <View style={[styles.tableCell, styles.dateCell]}>
              <Text>{new Date(entry.transactionDate).toLocaleDateString()}</Text>
            </View>
            <View style={[styles.tableCell, styles.amountCell]}>
              <Text style={entry.transactionType === "you will give" ? styles.redText : null}>
                {entry.transactionType === "you will give" ? entry.amount.toLocaleString('en-IN') : "-"}
              </Text>
            </View>
            <View style={[styles.tableCell, styles.amountCell]}>
              <Text style={entry.transactionType === "you will get" ? styles.greenText : null}>
                {entry.transactionType === "you will get" ? entry.amount.toLocaleString('en-IN') : "-"}
              </Text>
            </View>
            <View style={[styles.tableCell, styles.descriptionCell]}>
              <Text>{entry.description || "-"}</Text>
            </View>
            <View style={[styles.tableCell, styles.balanceCell]}>
              <Text style={entry.outstandingBalance < 0 ? styles.redText : styles.greenText}>
                {Math.abs(entry.outstandingBalance).toLocaleString('en-IN')}
              </Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.footer}>
        <View style={styles.footerContent}>
          <View style={styles.footerTop}>
            <Text style={styles.footerLogo}>HisaabKaro</Text>
            <View style={styles.footerDivider} />
            <Text style={styles.footerTagline}>
              Your Digital Expense Management Partner
            </Text>
          </View>
          
          <View style={styles.footerMiddle}>
            <Text style={styles.footerLink}>
              www.hisaabkaro.com
            </Text>
          </View>

          <View style={styles.footerBottom}>
            <Text style={styles.footerTimestamp}>
              Generated: {new Date().toLocaleDateString('en-US')}
            </Text>
            <View style={styles.footerDivider} />
            <Text style={styles.footerCopyright}>
              &copy; {new Date().getFullYear()} HisaabKaro. All rights reserved
            </Text>
          </View>
        </View>
      </View>
    </Page>
  </Document>
);

export default TransactionPDF;
