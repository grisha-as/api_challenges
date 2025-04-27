import { defineConfig } from "allure";

export default defineConfig({
  name: "Allure Report",
  output: "./allure-report",
  historyPath: "./history.jsonl",
  plugins: {
    awesome: {
      options: {
        reportName: "HelloWorld",
      },
    },
  },
});