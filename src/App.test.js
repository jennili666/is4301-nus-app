import { render, screen } from "@testing-library/react";
import Home from "./pages/Home";

test("home page shows the NUS logo and introduction text", () => {
  render(<Home />);
  expect(screen.getByAltText(/national university of singapore logo/i)).toBeInTheDocument();
  expect(
    screen.getByText("NUS is a leading research university in Asia")
  ).toBeInTheDocument();
});
