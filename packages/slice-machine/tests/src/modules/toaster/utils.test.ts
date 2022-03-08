import "@testing-library/jest-dom";

import { handleRemoteResponse, ToastPayload } from "@src/modules/toaster/utils";
import { ToasterType } from "@src/modules/toaster";

describe("[Toaster utils]", () => {
  describe("[handleRemoteResponse]", () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it("should call addToast function on an success", () => {
      const addToastFakeFunction = jest.fn();
      const toastPayload: ToastPayload = {
        loading: false,
        done: true,
        warning: false,
        message: "message",
        status: 200,
        error: null,
      };
      handleRemoteResponse(addToastFakeFunction)(toastPayload);

      expect(addToastFakeFunction).toHaveBeenCalledWith(
        "message",
        ToasterType.SUCCESS
      );
    });

    it("shouldn't call addToast function on an unfinished request", () => {
      const addToastFakeFunction = jest.fn();
      const toastPayload: ToastPayload = {
        loading: false,
        done: false,
        warning: false,
        message: "message",
        status: 200,
        error: null,
      };
      handleRemoteResponse(addToastFakeFunction)(toastPayload);

      expect(addToastFakeFunction).toHaveBeenCalledTimes(0);
    });

    it("shouldn't call addToast function on request with warnings", () => {
      const addToastFakeFunction = jest.fn();
      const toastPayload: ToastPayload = {
        loading: false,
        done: true,
        warning: true,
        message: "message",
        status: 200,
        error: null,
      };
      handleRemoteResponse(addToastFakeFunction)(toastPayload);

      expect(addToastFakeFunction).toHaveBeenCalledWith(
        "message",
        ToasterType.WARNING
      );
    });

    it("shouldn't call addToast function on a request with errors", () => {
      const addToastFakeFunction = jest.fn();
      const toastPayload: ToastPayload = {
        loading: false,
        done: true,
        warning: true,
        message: "message",
        status: 200,
        error: new Error(),
      };
      handleRemoteResponse(addToastFakeFunction)(toastPayload);

      expect(addToastFakeFunction).toHaveBeenCalledWith(
        "message",
        ToasterType.ERROR
      );
    });
  });
});
