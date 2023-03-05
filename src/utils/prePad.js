const prePad = (num) => {
    let numReceived = Number(num);
    numReceived += 1;
    if (numReceived > 100) {
        return `${numReceived}`;
    } else if (numReceived > 10) {
        return `0${numReceived}`;
    } else if (numReceived > 0) {
        return `00${numReceived}`;
    }
};

export default prePad;
