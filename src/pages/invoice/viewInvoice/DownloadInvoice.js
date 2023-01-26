import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
  Font,
} from "@react-pdf/renderer";
import CompanyLogo from "assets/images/pairroxz-logo.png";
import { dateCondition } from "utils/dateCondition";
import { capitalizeFirstLetter } from "utils/textTruncate";
import moment from "moment";
import Helvetica from "assets/pdfFonts/Helvetica.ttf";
import HelveticaLight from "assets/pdfFonts/helvetica-light.ttf";
import HelveticaBold from "assets/pdfFonts/Helvetica-Bold.ttf";
import { currencySymbol } from "utils/currency";

// import LatoRegular from "../../../assets/fonts"
// Font.register({
//     family: 'Lato',
//     fonts: [
//       {
//         src: `../../../assets/fonts/Lato-Regular.ttf`
//       },
//     //   {
//     //     src: `/Roboto-Bold.ttf`,
//     //     fontWeight: 'bold'
//     //   },
//     //   {
//     //     src: `/Roboto-Italic.ttf`,
//     //     fontWeight: 'normal',
//     //     fontStyle: 'italic'
//     //   },
//     //   {
//     //     src: `/Roboto-BoldItalic.ttf`,
//     //     fontWeight: 'bold',
//     //     fontStyle: 'italic'
//     //   }
//     ]
//   })
Font.register({
  family: "Helvetica",
  fonts: [
    {
      src: Helvetica,
    },
    {
      src: HelveticaLight,
      fontWeight: "light",
    },
    {
      src: HelveticaBold,
      fontWeight: "bold",
    },
    // {
    //   src: FontUbuntu700,
    //   fontWeight: 'normal',
    //   fontStyle: 'italic',
    // },
  ],
});
const styles = StyleSheet.create({
  page: {
    // backgroundColor: "#191b34",
    padding: 20,
    fontFamily: "Helvetica",
    // color:"#FFF"

    // fontFamily:"Lato"
  },
  mv10: {
    marginVertical: 10,
  },
  mb20: {
    marginBottom: 20,
  },
  flex: {
    flex: 1,
  },
  rowCenter: {
    flexDirection: "row",
    alignItems: "center",
  },
  companyLogo: {
    height: 43,
    width: 121,
    objectFit: "contain",
  },
  sectionOne: {
    // flexDirection: "row",
  },
  companyAddress: {
    fontSize: 10,
    marginBottom: 10,
    color: "#313538",
  },
  headingText: {
    // color:"rgba(255, 255, 255, 0.5)"
    color: "#777",
    fontWeight: "ultralight",
  },
  invoiceDetail: {
    backgroundColor: "#625df5",
    borderRadius: 21,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    color: "#FFF",
    fontSize: 12,
    marginBottom: 20,
  },
  headingTitle: {
    fontSize: 11,
    color: "#777",
  },
  boldText: {
    fontSize: 11,
    fontWeight: "bold",
  },
  amountText: {
    fontSize: 10,
    color: "#313538",
  },
  marginTop: {
    marginTop: 10,
  },
  amountRow: {
    justifyContent: "flex-end",
    marginBottom: 10,
  },
});

function DownloadInvoice({ item }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.sectionOne}>
          <View style={[styles.rowCenter, styles.mb20]}>
            <View style={[styles.flex]}>
              <Image src={CompanyLogo} style={styles.companyLogo} />
            </View>

            <View>
              <Text style={{ color: "#232e38", fontSize: 24 }}>INVOICE</Text>
              <Text
                style={[
                  styles.companyAddress,
                  {
                    fontWeight: "light",
                    color: "#777",
                  },
                ]}
              >
                #{item?.sNo}
              </Text>
            </View>
          </View>

          <View
            style={[
              {
                flexDirection: "row",
              },
              styles.companyAddress,
            ]}
          >
            <View
              style={{
                flex: 0.6,
                paddingRight: 20,
              }}
            >
              <Text
                style={{
                  color: "#000",
                  fontSize: 12,
                  marginBottom: 10,
                  fontFamily: "Helvetica-Bold",
                }}
              >
                {item?.subsiduary?.title}
              </Text>
              <Text style={[{ paddingRight: 20 }]}>
                {item?.subsiduary?.address}
                {/* {countWords(item?.subsiduary?.address)} */}
              </Text>
              <View style={{ marginTop: 20, flexDirection: "row" }}>
                <View style={styles.flex}>
                  <Text
                    style={[
                      styles.companyAddress,
                      {
                        marginBottom: 0,
                        fontWeight: "light",
                        fontSize: 12,
                        color: "#313538",
                        marginBottom: 5,
                      },
                      styles.headingText,
                    ]}
                  >
                    Bill To
                  </Text>
                  <View
                    style={{
                      fontSize: 10,
                      color: "rgba(0,0,0,0.9)",
                    }}
                  >
                    <Text
                      style={{
                        color: "rgba(0,0,0)",
                        // fontWeight: "bold",
                        marginBottom: 3,
                        // textTransform:"uppercase",
                        fontSize: 12,
                        fontFamily: "Helvetica-Bold",
                        marginTop: 5,
                      }}
                    >
                      {item?.customer?.fullName}
                    </Text>
                    {/* <Text
                      style={{
                        marginBottom: 3,
                  // color: "#000",

                      }}
                    >
                      {item?.customer?.email ?? ""}
                    </Text> */}
                    <Text
                      style={[
                        {
                          paddingRight: 20,
                          // color: "#000",
                        },
                      ]}
                    >
                      {item?.billTo ?? ""}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
            <View
              style={{
                flex: 0.6,
              }}
            >
              <View style={[styles.rowCenter, { marginLeft: 30 }]}>
                <Text
                  style={[
                    styles.companyAddress,
                    styles.flex,
                    styles.headingText,
                  ]}
                >
                  Date:
                </Text>
                <Text style={styles.companyAddress}>
                  {dateCondition(item?.raisedOn, "MMM DD, YYYY")}
                </Text>
              </View>
              <View style={[styles.rowCenter, { marginLeft: 30 }]}>
                <Text
                  style={[
                    styles.companyAddress,
                    styles.flex,
                    styles.headingText,
                  ]}
                >
                  Due Date:
                </Text>
                <Text style={styles.companyAddress}>
                  {dateCondition(item?.dueDate, "MMM DD, YYYY")}
                </Text>
              </View>

              <View style={[styles.rowCenter, { marginLeft: 30 }]}>
                <Text
                  style={[
                    styles.companyAddress,
                    styles.flex,
                    styles.headingText,
                  ]}
                >
                  GST Number:
                </Text>
                <Text style={styles.companyAddress}>
                  {item?.subsiduary?.gstNo}
                </Text>
              </View>

              <View
                style={[
                  styles.rowCenter,
                  {
                    backgroundColor: "#F5F5F5",
                    flex: 1,
                    paddingLeft: 30,
                    paddingRight: 10,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.companyAddress,
                    styles.flex,
                    styles.headingText,
                    {
                      marginBottom: 0,
                      color: "#000",
                      fontSize: 12,
                      fontFamily: "Helvetica-Bold",
                    },
                  ]}
                >
                  Balance Due:
                </Text>
                <Text
                  style={[
                    styles.companyAddress,
                    {
                      marginBottom: 0,
                      color: "#000",
                      fontSize: 12,
                      fontFamily: "Helvetica-Bold",
                    },
                  ]}
                >
                  {currencySymbol(item?.currency)}
                  {(
                    Number(item?.finalAmount) - Number(item?.paidAmount)
                  ).toFixed(2)}
                </Text>
              </View>

              <View
                style={[
                  styles.rowCenter,
                  {
                    // backgroundColor:"#F5F5F5",
                    flex: 1,
                    paddingLeft: 30,
                    paddingRight: 10,
                  },
                ]}
              />
            </View>
          </View>
        </View>

        {/* <View style={styles.invoiceDetail}>
          <View style={styles.flex}>
            <Text>Invoice Number</Text>
            <Text style={styles.mv10}>#PZ00{item?.sNo}</Text>
            <Text>
              Invoice Date:{dateCondition(item?.raisedOn, "DD MMM YYYY")}
            </Text>
            <Text style={styles.mv10}>
              Due Date:{dateCondition(item?.dueDate, "DD MM YYYY")}
            </Text>
          </View>

          <View style={[styles.flex, styles.mb20]}>
            <Text>Billed To</Text>
            <Text style={styles.mv10}>{item?.billTo}</Text>
            <Text>{item?.customer?.email ?? ""}</Text>
          </View>

          <View></View>
        </View> */}

        {/* <View
          style={{
            borderWidth: 1,
            paddingHorizontal: 20,
            borderColor: "#000",
            borderRadius: 21,
            marginBottom: 20,
            fontSize: 13,
            marginTop: 20,
          }}
        >
          <View style={[styles.rowCenter]}>
            <View style={[styles.flex, styles.mv10]}>
              <Text style={styles.headingTitle}>Project</Text>
              <Text style={{ marginTop: 5 }}>
                {capitalizeFirstLetter(item?.project?.title)}
              </Text>
            </View>

            <View style={[styles.flex, styles.mv10]}>
              <Text style={styles.headingTitle}>Payment Phase</Text>
              <Text style={{ marginTop: 5 }}>{item?.paymentPhase?.title}</Text>
            </View>
          </View>

          <View style={styles.rowCenter}>
            <View style={[styles.flex, styles.mv10]}>
              <Text style={styles.headingTitle}>Currency</Text>
              <Text style={{ marginTop: 5 }}>{item?.currency}</Text>
            </View>

            {item?.paymentPhase?.milestones?.length > 0 ? (
              <View style={[styles.flex, styles.mv10]}>
                <Text style={styles.headingTitle}>Milestone</Text>
                <Text style={{ marginTop: 5 }}>
                  {" "}
                  {item?.paymentPhase?.milestones
                    ?.map((row) => capitalizeFirstLetter(row?.title))
                    .join()}
                </Text>
              </View>
            ) : null}
          </View>
        </View> */}

        <View style={{ marginTop: 20 }}>
          {/* <Text style={[styles.mb10 , {fontSize:12 , color : "#313538"}]}>Service Detail</Text> */}

          <View
            style={{
              fontSize: 12,
              marginBottom: 10,
              marginTop: 10,
            }}
          >
            <View
              style={[
                styles.rowCenter,
                {
                  fontWeight: "bold",
                  fontSize: 11,

                  color: "#FFF",
                  backgroundColor: "#3a3a3a",
                  paddingVertical: 5,
                  marginBottom: 5,
                  borderRadius: 4,
                },
              ]}
            >
              <Text style={{ width: "60%", paddingRight: 10, paddingLeft: 5 }}>
                Description
              </Text>
              <Text
                style={{ width: "13%", paddingRight: 10, textAlign: "right" }}
              >
                Quantity
              </Text>
              <Text
                style={{ width: "13%", paddingRight: 10, textAlign: "right" }}
              >
                Rate
              </Text>
              <Text style={{ width: "13%", textAlign: "right" }}>Amount</Text>
            </View>

            {item?.services?.map((_item) => (
              <View
                style={[
                  styles.rowCenter,
                  {
                    marginBottom: 10,
                    color: "#313538",
                    borderBottomWidth: 1,
                    borderColor: "#efefef",
                    paddingBottom: 10,
                  },
                ]}
                key={_item?._id}
              >
                <Text
                  style={{
                    width: "60%",
                    paddingRight: 10,
                    paddingLeft: 5,
                    fontSize: 10,
                    color: "#000",
                  }}
                >
                  {_item?.description}
                </Text>
                <Text
                  style={{
                    width: "13%",
                    marginRight: 5,
                    textAlign: "center",
                    paddingLeft: 15,
                    fontSize: 10,
                  }}
                >
                  {_item?.quantity}
                </Text>
                <Text
                  style={{
                    width: "13%",
                    marginRight: 5,
                    textAlign: "right",
                    paddingRight: 10,
                    fontSize: 10,
                  }}
                >
                  {currencySymbol(item?.currency)}
                  {_item?.rate}
                </Text>
                <Text
                  style={{
                    width: "13%",
                    textAlign: "right",
                    paddingRight: 15,
                    fontSize: 10,
                  }}
                >
                  {currencySymbol(item?.currency)}
                  {_item?.amount}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View style={{ flexDirection: "row" }}>
          <View style={{ flex: 1 }}>
            {item?.noteForClient ? (
              <View style={[styles.companyAddress, { fontSize: 9 }]}>
                <Text style={[styles.headingText, { marginBottom: 5 }]}>
                  Notes for client:
                </Text>
                <View
                  style={{
                    // borderWidth: 0.8,
                    // borderColor: "#777",
                    borderRadius: 4,
                    padding: 5,
                    paddingBottom: 20,
                    backgroundColor: "#F5F5F5",
                  }}
                >
                  <Text style={[styles.amountText, { fontSize: 9 }]}>
                    {item?.noteForClient}
                  </Text>
                </View>
              </View>
            ) : null}

            {item?.paymentTerms ? (
              <View style={[styles.companyAddress, { fontSize: 9 }]}>
                <Text style={[styles.headingText, { marginBottom: 5 }]}>
                  Payment Terms:
                </Text>
                <View
                  style={{
                    // borderWidth: 0.8,
                    // borderColor: "#777",
                    borderRadius: 4,
                    padding: 5,
                    paddingBottom: 20,
                    backgroundColor: "#F5F5F5",
                  }}
                >
                  <Text style={[styles.amountText, { fontSize: 9 }]}>
                    {item?.paymentTerms}
                  </Text>
                </View>
              </View>
            ) : (
              <View style={{ flex: 1 }} />
            )}
          </View>
          <View style={{ flex: 1 }}>
            <View style={[styles.rowCenter, styles.amountRow]}>
              <View style={{ flex: 1 }} />
              <Text
                style={[
                  styles.boldText,
                  styles.headingText,
                  { flex: 0.3, textAlign: "right" },
                ]}
              >
                Sub Total:
              </Text>
              <Text
                style={[
                  styles.amountText,
                  { marginRight: 15, flex: 0.3, textAlign: "right" },
                ]}
              >
                {currencySymbol(item?.currency)}
                {item?.basicAmount}
              </Text>
            </View>

            {Number(item?.discount?.discountedAmount) > 0 ? (
              <View style={[styles.rowCenter, styles.amountRow]}>
                <View style={{ flex: 1 }} />

                <Text
                  style={[
                    styles.boldText,
                    styles.headingText,
                    { flex: 0.3, textAlign: "right" },
                  ]}
                >
                  Discount:
                </Text>
                <Text
                  style={[
                    styles.amountText,
                    { marginRight: 15, flex: 0.3, textAlign: "right" },
                  ]}
                >
                  {" "}
                  {currencySymbol(item?.currency)}
                  {item?.discount?.discountedAmount ?? 0.0}
                </Text>
              </View>
            ) : null}
            {Number(item?.totalTaxes) > 0 ? (
              <View style={[styles.rowCenter, styles.amountRow]}>
                <View style={{ flex: 1 }} />

                <Text
                  style={[
                    styles.boldText,
                    styles.headingText,
                    { flex: 0.3, textAlign: "right" },
                  ]}
                >
                  Tax:
                </Text>
                <Text
                  style={[
                    styles.amountText,
                    { marginRight: 15, flex: 0.3, textAlign: "right" },
                  ]}
                >
                  {currencySymbol(item?.currency)}
                  {item?.totalTaxes ?? 0}
                </Text>
              </View>
            ) : null}

            <View style={[styles.rowCenter, styles.amountRow]}>
              <View style={{ flex: 1 }} />

              <Text
                style={[
                  styles.boldText,
                  styles.headingText,
                  { flex: 0.3, textAlign: "right" },
                ]}
              >
                Total:
              </Text>
              <Text
                style={[
                  styles.amountText,
                  { marginRight: 15, flex: 0.3, textAlign: "right" },
                ]}
              >
                {currencySymbol(item?.currency)}
                {item?.finalAmount}
              </Text>
            </View>
            {Number(item?.paidAmount) > 0 ? (
              <View style={[styles.rowCenter, styles.amountRow]}>
                <View style={{ flex: 1 }} />

                <Text
                  style={[
                    styles.boldText,
                    styles.headingText,
                    { flex: 0.3, textAlign: "right" },
                  ]}
                >
                  Amount Paid:
                </Text>
                <Text
                  style={[
                    styles.amountText,
                    { marginRight: 15, flex: 0.3, textAlign: "right" },
                  ]}
                >
                  {currencySymbol(item?.currency)}
                  {item?.paidAmount}
                </Text>
              </View>
            ) : null}
          </View>
        </View>

        {/* <View style={[styles.rowCenter, styles.amountRow]}>
          <View style={{ flex: 1 }} />

          <Text
            style={[
              styles.boldText,
              styles.headingText,
              { flex: 0.3, textAlign: "right" },
            ]}
          >
            Balance Due:
          </Text>
          <Text
            style={[
              styles.amountText,
              { marginRight: 20, flex: 0.3, textAlign: "right" },
            ]}
          >
            {" "}
            {currencySymbol(item?.currency)}
            {(Number(item?.finalAmount) - Number(item?.paidAmount)).toFixed(2)}
          </Text>
        </View> */}
        {/* </View> */}

        {/* <View
          style={{
            borderWidth: 1,
            borderColor: "#000",
          }}
        /> */}

        {/* <View style={{ marginTop: 20 }}>
          <View style={styles.rowCenter}>
            <View style={[styles.rowCenter, { flex: 0.5 }]}>
              <Text style={[styles.flex, styles.boldText , styles.headingText]}>Sub Total</Text>
              <Text style={styles.amountText}>{item?.basicAmount}</Text>
            </View>
            <View style={{ flex: 0.2 }} />
            <View style={[styles.rowCenter, { flex: 0.5 }]}>
              <Text style={[styles.flex, styles.boldText , styles.headingText]}>Total</Text>
              <Text style={styles.amountText}>{item?.finalAmount}</Text>
            </View>
          </View>

          <View style={[styles.rowCenter, styles.marginTop]}>
            <View style={[styles.rowCenter, { flex: 0.5 }]}>
              <Text style={[styles.flex, styles.boldText , styles.headingText]}>Tax</Text>
              <Text style={styles.amountText}>{item?.totalTaxes ?? 0}</Text>
            </View>
            <View style={{ flex: 0.2 }} />
            <View style={[styles.rowCenter, { flex: 0.5 }]}>
              <Text style={[styles.flex, styles.boldText , styles.headingText]}>Amount Paid</Text>
              <Text style={styles.amountText}>{item?.paidAmount}</Text>
            </View>
          </View>

          <View style={[styles.rowCenter, styles.marginTop]}>
            <View style={[styles.rowCenter, { flex: 0.5 }]}>
              <Text style={[styles.flex, styles.boldText , styles.headingText]}>Discount</Text>
              <Text style={styles.amountText}>
            {item?.discount?.discountedAmount ?? 0.0}
              </Text>
            </View>
            <View style={{ flex: 0.2 }} />
            <View style={[styles.rowCenter, { flex: 0.5 }]}>
              <Text style={[styles.flex, styles.boldText , styles.headingText]}>Balance Due</Text>
              <Text style={styles.amountText}>
            {(Number(item?.finalAmount) - Number(item?.paidAmount)).toFixed(
                  2
                )}
              </Text>
            </View>
          </View>

          <View style={[styles.rowCenter, styles.marginTop]}>
            <View style={[styles.rowCenter, { flex: 0.5 }]}>
          
            </View>
            <View style={{ flex: 0.2 }} />
            <View style={[styles.rowCenter, { flex: 0.5 }]}>
              <Text style={[styles.flex, styles.boldText , styles.headingText]}>Currency</Text>
              <Text style={styles.amountText}>
            {item?.currency}
              </Text>
            </View>
          </View>
        </View> */}
        {/* 
        <View style={{ flexDirection: "row" }}>
          {item?.noteForClient ? (
            <View
              style={[
                styles.companyAddress,
                { marginTop: 20, fontSize: 9, flex: 1, marginRight: 10 },
              ]}
            >
              <Text style={[styles.headingText, { marginBottom: 5 }]}>
                Note for client:
              </Text>
              <View
                style={{
                  // borderWidth: 0.8,
                  // borderColor: "#777",
                  borderRadius: 4,
                  padding: 5,
                  paddingBottom: 20,
                  backgroundColor: "#F5F5F5",

                }}
              >
                <Text style={[styles.amountText, { fontSize: 9 }]}>
                  {item?.noteForClient}
                </Text>
              </View>
            </View>
          ) : null}

          {item?.paymentTerms ? (
            <View
              style={[
                styles.companyAddress,
                { marginTop: 20, fontSize: 9, flex: 1 },
              ]}
            >
              <Text style={[styles.headingText, { marginBottom: 5 }]}>
                Payment Terms:
              </Text>
              <View
                style={{
                  // borderWidth: 0.8,
                  // borderColor: "#777",
                  borderRadius: 4,
                  padding: 5,
                  paddingBottom: 20,
                  backgroundColor: "#F5F5F5",

                }}
              >
                <Text style={[styles.amountText, { fontSize: 9 }]}>
                  {item?.paymentTerms}
                </Text>
              </View>
            </View>
          ) : (
            <View style={{ flex: 1 }} />
          )}
        </View> */}
      </Page>
    </Document>
  );
}

export default DownloadInvoice;
