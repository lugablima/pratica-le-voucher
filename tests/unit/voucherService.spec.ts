import voucherRepository from "repositories/voucherRepository";
import voucherService, { MIN_VALUE_FOR_DISCOUNT } from "services/voucherService";
import voucherFactory from "../factory/voucherFactory";
import * as errorUtils from "../../src/utils/errorUtils";
import errorFactory from "../factory/errorFactory";

describe("Voucher Service", () => {
    describe("Create Voucher function", () => {
        it("should return void if given a valid voucher code", async () => {
            const voucher = voucherFactory.create();

            jest.spyOn(voucherRepository, "getVoucherByCode").mockResolvedValueOnce(null);
            jest.spyOn(voucherRepository, "createVoucher").mockResolvedValueOnce(null);

            const result = await voucherService.createVoucher(voucher.code, voucher.discount);

            expect(result).toBeUndefined();
        });

        it("should return a conflict error if given a voucher code that already exists", async () => {
            const voucher = voucherFactory.create();
            const expectedError = errorFactory.conflict("Voucher already exist.");

            jest.spyOn(voucherRepository, "getVoucherByCode").mockResolvedValueOnce({ ...voucher, id: 1 });
            jest.spyOn(errorUtils, "conflictError").mockReturnValueOnce(expectedError);

            const result = voucherService.createVoucher(voucher.code, voucher.discount);

            expect(result).rejects.toEqual(expectedError);
        });
    });

    describe("Apply Voucher function", () => {
        it("should return a 10% discount if given valid voucher infos", async () => {
            const voucher = voucherFactory.create({ discount: 10, used: false });
            const amount = MIN_VALUE_FOR_DISCOUNT;
            const expectedResult = voucherFactory.applyVoucherResult({ amount, discount: voucher.discount, applied: true });

            jest.spyOn(voucherRepository, "getVoucherByCode").mockResolvedValueOnce({ ...voucher, id: 1 });
            jest.spyOn(voucherRepository, "useVoucher").mockResolvedValueOnce(null);

            const result = await voucherService.applyVoucher(voucher.code, amount);

            expect(result).toEqual(expectedResult);
        });

        it("should return an conflict error if given a voucher code that does not exist", async () => {
            const voucher = voucherFactory.create();
            const amount = MIN_VALUE_FOR_DISCOUNT;
            const expectedError = errorFactory.conflict("Voucher does not exist.");

            jest.spyOn(voucherRepository, "getVoucherByCode").mockResolvedValueOnce(null);

            const result = voucherService.applyVoucher(voucher.code, amount);

            expect(result).rejects.toEqual(expectedError);
        });

        it("should not apply discount to amounts less than MIN_VALUE_FOR_DISCOUNT", async () => {
            const voucher = voucherFactory.create();
            const amount = MIN_VALUE_FOR_DISCOUNT - 1;
            const expectedResult = voucherFactory.applyVoucherResult({ amount, discount: voucher.discount, applied: false });

            jest.spyOn(voucherRepository, "getVoucherByCode").mockResolvedValueOnce({ ...voucher, id: 1 });

            const result = await voucherService.applyVoucher(voucher.code, amount);

            expect(result).toEqual(expectedResult);
        });

        it("should not apply discount to a voucher that has already been used", async () => {
            const voucher = voucherFactory.create({ used: true });
            const amount = MIN_VALUE_FOR_DISCOUNT;
            const expectedResult = voucherFactory.applyVoucherResult({ amount, discount: voucher.discount, applied: false });

            jest.spyOn(voucherRepository, "getVoucherByCode").mockResolvedValueOnce({ ...voucher, id: 1 });

            const result = await voucherService.applyVoucher(voucher.code, amount);

            expect(result).toEqual(expectedResult);
        });

        it("should not apply discount to a voucher that has already been used and with an amount less than MIN_VALUE_FOR_DISCOUNT", async () => {
            const voucher = voucherFactory.create({ used: true });
            const amount = MIN_VALUE_FOR_DISCOUNT - 1;
            const expectedResult = voucherFactory.applyVoucherResult({ amount, discount: voucher.discount, applied: false });

            jest.spyOn(voucherRepository, "getVoucherByCode").mockResolvedValueOnce({ ...voucher, id: 1 });

            const result = await voucherService.applyVoucher(voucher.code, amount);

            expect(result).toEqual(expectedResult);
        });
    });
});