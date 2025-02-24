/**
 * @jest-environment jsdom
 **/

import "@testing-library/jest-dom";
import React from "react";
import { render, act, fireEvent } from "../../test-utils";
import Modal from "react-modal";
import EditModal from "@lib/builders/common/EditModal";

jest.mock("next/dist/client/router", () => require("next-router-mock"));

describe("EditModal", () => {
  const div = document.createElement("div");
  Modal.setAppElement(div);
  div.id = "__next";
  document.body.appendChild(div);

  test("remove an item from a select field", async () => {
    const saveFn = jest.fn();
    const closeFn = jest.fn();
    const getFieldMockConfigFn = jest.fn();
    const field = {
      key: "selecta",
      value: {
        type: "Select",
        config: {
          label: "selecta",
          placeholder: "",
          options: ["1", "2", "3"],
        },
      },
    };
    const data = {
      isOpen: true,
      field: [field.key, field.value],
    };

    const fields = [field];

    const app = await render(
      <EditModal
        onSave={saveFn}
        close={closeFn}
        getFieldMockConfig={getFieldMockConfigFn}
        data={data}
        fields={fields}
      />
    );

    const removeButton = document.querySelector(
      'input[name="config.options.2"]'
    )?.nextSibling;

    await act(async () => fireEvent.click(removeButton));

    const saveButton = document.querySelector('button[type="submit"]');

    await act(async () => fireEvent.click(saveButton));

    expect(saveFn).toHaveBeenCalled();

    const saveData = saveFn.mock.calls[0][0];
    const options = saveData.value.config.options;
    expect(options).toEqual(["1", "2"]);
  });

  test("it should not overwrite custom properties", async () => {
    const field = {
      key: "rt_box",
      value: {
        type: "StructuredText",
        config: {
          label: "rt box",
          placeholder: "",
          allowTargetBlank: true,
          labels: ["right-align", "center-align"],
          single:
            "paragraph,preformatted,heading1,heading2,heading3,heading4,heading5,heading6,strong,em,hyperlink,image,embed,list-item,o-list-item,rtl",
        },
      },
    };

    const data = {
      isOpen: true,
      field: [field.key, field.value],
    };

    const fields = [field];

    const saveFn = jest.fn();
    const closeFn = jest.fn();
    const getFieldMockConfigFn = jest.fn();

    const app = await render(
      <EditModal
        onSave={saveFn}
        close={closeFn}
        getFieldMockConfig={getFieldMockConfigFn}
        data={data}
        fields={fields}
      />
    );

    const labelInput = document.querySelector('input[name="config.label"]');
    const fakeLabel = "rich text";
    await act(async () =>
      fireEvent.change(labelInput, { target: { value: fakeLabel } })
    );

    const idInput = document.querySelector('input[name="id"]');
    const fakeId = "some_id";
    await act(async () =>
      fireEvent.change(idInput, { target: { value: fakeId } })
    );

    const saveButton = document.querySelector('button[type="submit"]');
    await act(async () => fireEvent.click(saveButton));

    expect(saveFn).toHaveBeenCalled();
    const saveData = saveFn.mock.calls[0][0];
    expect(saveData.value.config.labels).toEqual([
      "right-align",
      "center-align",
    ]);
  });
});
