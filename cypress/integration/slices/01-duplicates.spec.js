describe("Duplicate Slices", () => {
  const name = "DuplicateSlices";
  const lib = "slices--ecommerce";
  beforeEach(() => {
    cy.clearLocalStorageSnapshot();
    cy.cleanSliceMachineUserContext();
    cy.task("rmrf", `e2e-projects/next/slices/ecommerce/${name}`);
  });

  it("A user can not create two slices with the same name", () => {
    cy.setupSliceMachineUserContext();

    // create first slice
    cy.visit(`/slices`);
    cy.waitUntil(() => cy.get("[data-cy=create-slice]"));
    cy.get("[data-cy=create-slice]").click();
    cy.get("[data-cy=create-slice-modal]").should("be.visible");

    cy.get("input[data-cy=slice-name-input]").type(name);
    cy.get("[data-cy=create-slice-modal]").submit();
    cy.location("pathname", { timeout: 20000 }).should(
      "eq",
      `/${lib}/${name}/default`
    );
    cy.visit(`/${lib}/${name}/default`);
    cy.location("pathname", { timeout: 20000 }).should(
      "eq",
      `/${lib}/${name}/default`
    );

    // do it again
    cy.visit(`/slices`);
    cy.waitUntil(() => cy.get("[data-cy=create-slice]"));
    cy.get("[data-cy=create-slice]").click();
    cy.get("[data-cy=create-slice-modal]").should("be.visible");

    cy.get("input[data-cy=slice-name-input]").type(name);
    cy.get("form").click();
    cy.get("[type=submit]").should("be.disabled");
    cy.get("[data-cy=slice-name-input-error]").contains(
      "Slice name is already taken."
    );
  });
});
