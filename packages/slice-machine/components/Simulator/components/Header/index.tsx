import router from "next/router";
import { Box, Text, Flex } from "theme-ui";
import * as Models from "@slicemachine/core/build/models";

import VarationsPopover from "@lib/builders/SliceBuilder/Header/VariationsPopover";
import * as Links from "@lib/builders/SliceBuilder/links";

import ScreenSizes, { Size } from "../ScreenSizes";
import { ComponentUI } from "@lib/models/common/ComponentUI";

type PropTypes = {
  Model: ComponentUI;
  variation: Models.VariationSM | undefined;
  handleScreenSizeChange: (screen: { size: Size }) => void;
  size: Size;
};

const redirect = (
  model: ComponentUI,
  variation: { id: string } | undefined,
  isSimulator?: boolean
): void => {
  if (!variation) {
    void router.push(`/${model.href}/${model.model.name}`);
    return;
  }
  const params = Links.variation({
    lib: model.href,
    sliceName: model.model.name,
    variationId: variation?.id,
    isSimulator,
  });
  void router.push(params.href, params.as, params.options);
};

const Header: React.FunctionComponent<PropTypes> = ({
  Model,
  variation,
  handleScreenSizeChange,
  size,
}) => {
  return (
    <Box
      sx={{
        p: 3,
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gridTemplateRows: "1fr",
        borderBottom: "1px solid #F1F1F1",
      }}
    >
      <Flex
        sx={{
          alignItems: "center",
        }}
      >
        <Text mr={2}>{Model.model.name}</Text>
        {Model.model.variations.length > 1 ? (
          <VarationsPopover
            buttonSx={{ p: 1 }}
            defaultValue={variation}
            variations={Model.model.variations}
            onChange={(v) => redirect(Model, v, true)}
          />
        ) : null}
      </Flex>
      <Flex
        sx={{
          alignItems: "center",
          justifyContent: "space-around",
        }}
      >
        <ScreenSizes size={size} onClick={handleScreenSizeChange} />
      </Flex>
    </Box>
  );
};

export default Header;
