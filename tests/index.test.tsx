import { render } from "@testing-library/react";
import React from "react";
import { UserProvider, useUser } from "../src";

const TestComponent = () => {
  const user = useUser();
  return user ? (
    <div>
      <span data-testid="name">{user?.name}</span>
      <span data-testid="email">{user?.email}</span>
      <span data-testid="avatarUrl">{user?.avatarUrl}</span>
    </div>
  ) : (
    <div>No User</div>
  );
};

test("Renders User Provider component", async () => {
  const { findByTestId } = render(
    <UserProvider
      autoLoginConfig={[
        {
          getToken: () => "SECRET",
          getUser: () =>
            Promise.resolve({
              name: "David Vargas",
              email: "dvargas92495@gmail.com",
              avatarUrl: "img.png",
            }),
        },
      ]}
      handleError={console.error}
    >
      <TestComponent />
    </UserProvider>
  );
  const name = await findByTestId("name");
  expect(name).toHaveTextContent("David Vargas");
  const email = await findByTestId("email");
  expect(email).toHaveTextContent("dvargas92495@gmail.com");
  const avatarUrl = await findByTestId("avatarUrl");
  expect(avatarUrl).toHaveTextContent("img.png");
});
