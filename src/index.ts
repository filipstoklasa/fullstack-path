import { program, InvalidArgumentError } from "commander";
import { load } from "cheerio";

type GetTextContent = (
  options: { selectors?: string },
  args: { args: string[] }
) => Promise<void>;

const getTextContent: GetTextContent = async ({ selectors }, { args }) => {
  if (!selectors) throw new InvalidArgumentError("Missing selectors");
  if (!args[0]) throw new InvalidArgumentError("Missing URL");

  const res = await fetch(args[0]);
  const text = await res.text();
  const $ = load(text);

  console.log(selectors.split(",").map((selector) => $(selector).text()));
  process.exit(0);
};

program
  .option("-s, --selectors <string>", "Comma separated list of selectors")
  .action(getTextContent)
  .parseAsync(process.argv);

export { program };
