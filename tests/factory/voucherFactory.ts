import { VoucherCreateData } from "services/voucherService";

type CreateProps = Partial<VoucherCreateData>;

function create(props?: CreateProps) {
    const voucher: VoucherCreateData = {
        code: props?.code ?? "CODE_TEST",
        discount: props?.discount ?? 10, 
        used: props?.used ?? false 
    }

    return voucher;
}

interface ApplyVoucherResultProps {
    amount: number;
    discount: number;
    finalAmount?: number;
    applied: boolean;
}

function applyDiscount(value: number, discount: number) {
    return value - (value * (discount / 100));
}
 
function applyVoucherResult({ amount, discount, finalAmount, applied }: ApplyVoucherResultProps): ApplyVoucherResultProps {
    const finalAmountCalculated = applied ? applyDiscount(amount, discount) : amount;
    
    return {
        amount,
        discount,
        finalAmount: finalAmount ?? finalAmountCalculated,
        applied
    }
}

export default {
    create,
    applyVoucherResult
}
