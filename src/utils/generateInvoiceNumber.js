import prePad from './prePad';

const generateInvoiceNumber = (list) => {
    const prevNo = list[list.length - 1];
    console.log('prevNo', prevNo);
    console.log('list', list);
    const currYear = new Date().getFullYear() % 100;
    if (!prevNo) return `PT/GST/${currYear - 1}-${currYear}/001`;
    const [x, y, yearArr, numArr] = prevNo.split('/');
    console.log('yearArr', yearArr);
    console.log('numArr', numArr);
    let prevYearLast = yearArr.split('-')[0] * 1;
    let prevYearNext = yearArr.split('-')[1] * 1;
    let currNo;
    if (currYear > prevYearNext) {
        prevYearNext = currYear;
        prevYearLast = currYear - 1;
        currNo = `${x}/${y}/${prevYearLast}-${prevYearNext}/001`;
    } else {
        currNo = `${x}/${y}/${prevYearLast}-${prevYearNext}/${prePad(numArr)}`;
    }
    return currNo;
};

export default generateInvoiceNumber;
