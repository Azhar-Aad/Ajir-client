import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { BrowserRouter } from "react-router-dom";
import AddProductPage from "../AddProductPage";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => jest.fn(),
}));

describe("AddProductPage Tests", () => {
  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve([
            {
              _id: "1",
              category: "Furniture",
              image: "data:image/jpeg;base64,xxx",
            },
          ]),
      })
    );
  });


  test("matches snapshot", () => {
  const { asFragment } = renderPage();
  expect(asFragment()).toMatchSnapshot();
});

  const renderPage = () =>
    render(
      <BrowserRouter>
        <AddProductPage />
      </BrowserRouter>
    );

  test("renders form fields", () => {
    renderPage();

    // FIXED HERE
    expect(
      screen.getByRole("heading", { name: /Add Product/i })
    ).toBeInTheDocument();

    expect(screen.getByLabelText(/Category/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Rental place/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Quantity/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Price\/day/i)).toBeInTheDocument();
  });

  test("loads products and displays them", async () => {
    renderPage();

    expect(await screen.findByText("Furniture")).toBeInTheDocument();
  });
});
