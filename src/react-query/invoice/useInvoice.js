import { getInvoice } from 'api/invoice';
import { useQuery } from 'react-query';

export const useInvoice = ({
    orgId,
    financialYear,
    subsiduary,
    projectId,
    month,
}) => {
    return useQuery(
        ['invoice', orgId, financialYear, subsiduary],
        () =>
            getInvoice({ orgId, financialYear, subsiduary, projectId, month }),
        {
            retry: 0,
            refetchOnWindowFocus: false,
            enabled: !!orgId,
            keepPreviousData: true,
        }
    );
};
