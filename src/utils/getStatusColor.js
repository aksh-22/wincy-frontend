const statusColor = (type) => {
    switch (type) {
        case 'Partially Invoiced':
            return 'var(--chipYellow)';

        case 'Pending':
        case 'Unpaid':
            return 'var(--red)';

        case 'Invoiced':
        case 'Paid':
            return 'var(--green)';

        case 'Partially Paid':
            return 'var(--chipYellow)';

        default:
            return 'secondary';
    }
};

export default statusColor;
