
import { useEffect, useMemo, useState } from "react";
import {
  ArrowDown,
  ShieldCheck,
  Globe2,
  Workflow,
  BookOpen,
  Sparkles,
} from "lucide-react";
import CodeBlock from "../components/CodeBlock";
import ScrollRevealContainer from "../components/ScrollRevealContainer";
import AskPageSection from "../components/AskPageSection";
import { Theme } from "../types";

const featureCards = [
  {
    title: "Real-time Exchange Rates",
    description:
      "Access live exchange rates for 180+ currencies with transparent pricing and competitive spreads.",
    icon: <Sparkles className="h-6 w-6 text-sky-400" />,
  },
  {
    title: "Compliance & Security",
    description:
      "Built-in AML/KYC workflows, encrypted transport, and regulatory coverage keep every transaction compliant.",
    icon: <ShieldCheck className="h-6 w-6 text-purple-400" />,
  },
  {
    title: "Global Coverage",
    description:
      "Disburse funds to more than 200 countries and territories with multiple payout partners and rails.",
    icon: <Globe2 className="h-6 w-6 text-emerald-400" />,
  },
  {
    title: "Multiple Payment Methods",
    description:
      "Bank transfers, wallets, cash pickup, and mobile money � orchestrated through one integration layer.",
    icon: <Workflow className="h-6 w-6 text-amber-300" />,
  },
];

const quickStartSteps = [
  {
    title: "Get your API credentials",
    description: "Create a developer account and collect your client ID and client secret.",
  },
  {
    title: "Make your first request",
    description: "Authenticate, fetch exchange rates, and create your first sandbox transaction.",
  },
  {
    title: "Test and go live",
    description: "Use sandbox to perfect your flows, then switch credentials to production.",
  },
];

const corridors = [
  { code: "PK", country: "Pakistan", currency: "PKR" },
  { code: "IN", country: "India", currency: "INR" },
  { code: "EG", country: "Egypt", currency: "EGP" },
  { code: "CN", country: "China", currency: "CNY" },
  { code: "LK", country: "Sri Lanka", currency: "LKR" },
  { code: "PH", country: "Philippines", currency: "PHP" },
  { code: "BD", country: "Bangladesh", currency: "BDT" },
  { code: "NP", country: "Nepal", currency: "NPR" },
];

const codeExamples = [
  {
    language: "bash",
    label: "Shell",
    code: `# Get an access token
curl https://drap-sandbox.digitnine.com/auth/realms/cdp/protocol/openid-connect/token \
  -X POST \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=password&client_id={CLIENT_ID}&client_secret={CLIENT_SECRET}&username={USERNAME}&password={PASSWORD}"

# Make your first API call
curl https://drap-sandbox.digitnine.com/raas/masters/v1/countries \
  -H "Authorization: Bearer {ACCESS_TOKEN}" \
  -H "x-sender: testpartner" \
  -H "x-channel: Direct"`,
  },
  {
    language: "javascript",
    label: "JavaScript",
    code: `import axios from 'axios';

async function createTransaction(payload) {
  const token = await getAccessToken();

  const { data } = await axios.post(
    'https://drap-sandbox.digitnine.com/raas/api/v1_0/ras/createtransaction',
    payload,
    {
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
        'x-channel': 'Direct',
      },
    },
  );

  return data;
}`,
  },
  {
    language: "python",
    label: "Python",
    code: `import os
import requests

def fetch_branches(bank_id: str):
    token = os.environ['ACCESS_TOKEN']
    url = f"https://drap-sandbox.digitnine.com/raas/masters/v1/branches/{bank_id}"

    headers = {
        'Authorization': 'Bearer ' + token,
        'x-channel': 'Direct',
    }

    response = requests.get(url, headers=headers)
    response.raise_for_status()
    return response.json()`
  },
];
const getRootTheme = (): "light" | "dark" => {
  if (typeof document === "undefined") {
    return "light";
  }
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
};

const IntroductionPage = () => {
  const [themeMode, setThemeMode] = useState<"light" | "dark">(getRootTheme);

  useEffect(() => {
    if (typeof document === "undefined" || typeof MutationObserver === "undefined") {
      return;
    }

    const update = () => setThemeMode(getRootTheme());
    update();

    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  const codeTheme: Theme = useMemo(() => ({ mode: themeMode }), [themeMode]);

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <ScrollRevealContainer>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            API Introduction
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
            The Digit9 worldAPI is REST-first: predictable resource URLs, JSON request bodies, and OAuth 2.0 authentication flows.
            Use this guide to explore the capabilities that power global payments and treasury automation.
          </p>
          <div className="flex flex-wrap gap-4">
            <button
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-700 px-5 py-3 text-sm font-semibold text-white transition"
            >
              Get Started
              <ArrowDown className="h-4 w-4" />
            </button>
          </div>
        </div>
      </ScrollRevealContainer>

        {/* AskPage Section */}
        <ScrollRevealContainer>
          <AskPageSection showButtons={false} />
        </ScrollRevealContainer>

      <ScrollRevealContainer>
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Globe2 className="h-6 w-6" />
            BASE URL
          </h2>
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <code className="text-lg font-mono text-gray-900 dark:text-gray-100">
              https://drap-sandbox.digitnine.com
            </code>
          </div>
        </section>
      </ScrollRevealContainer>

      <ScrollRevealContainer>
        <div className="grid gap-10 lg:grid-cols-[2fr,1fr] mb-12">
          <section className="bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8 space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">What is Digit9 worldAPI?</h2>
            <p className="text-base leading-relaxed text-gray-600 dark:text-gray-300">
              <strong>Digit9 worldAPI (Remittance as a Service)</strong> unlocks cross-border payments inside your applications. Build on our APIs to access real-time FX rates, compliance checks, payout orchestration, and settlement tracking across multiple corridors using a single integration layer.
            </p>
            <p className="text-base leading-relaxed text-gray-600 dark:text-gray-300">
              Combine REST endpoints with webhooks, SDKs, and dashboards to launch new payment experiences quickly while leveraging Digit9&apos;s licensing, banking partnerships, and operational expertise.
            </p>
          </section>

          <aside className="bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 space-y-3">
            <p className="text-sm font-medium text-gray-900 dark:text-white">Just getting started?</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Explore our quickstart guide to create your first sandbox transaction and tour the developer tooling.
            </p>
            <button
              className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition"
            >
              Development quickstart guide
              <ArrowDown className="h-4 w-4" />
            </button>
          </aside>
        </div>
      </ScrollRevealContainer>

      <ScrollRevealContainer>
        <section className="space-y-6 mb-12">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">Core Features</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">Everything you need to launch cross-border payouts at scale.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {featureCards.map((feature) => (
              <div
                key={feature.title}
                className="bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-blue-400 dark:hover:border-blue-500"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-700">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>
      </ScrollRevealContainer>

      <ScrollRevealContainer>
        <section className="grid gap-10 lg:grid-cols-[1.35fr,1fr] mb-12">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8 h-full">
            <h2 className="text-xl font-semibold flex items-center gap-2 text-gray-900 dark:text-white">
              <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" /> Quick Start
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Get up and running in a few guided steps. Our REST endpoints use JSON payloads and standard HTTP verbs.
            </p>
            <ol className="mt-6 space-y-4">
              {quickStartSteps.map((step, index) => (
                <li key={step.title} className="flex items-start gap-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full text-sm font-semibold bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white">
                    {index + 1}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{step.title}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{step.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 h-full grid"> 
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold text-gray-900 dark:text-white">Example Request</p>
              <span className="text-xs text-gray-600 dark:text-gray-400">Try it in your preferred language</span>
            </div>
            <CodeBlock theme={codeTheme} examples={codeExamples} />
          </div>
        </section>
      </ScrollRevealContainer>

      <ScrollRevealContainer>
        <section className="space-y-6 mb-12">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Supported Corridors</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Reach more than 200 countries and territories with competitive exchange rates and diverse payout options.
              </p>
            </div>
            <span className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-500">And dozens more corridors via the Digit9 network</span>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {corridors.map((corridor) => (
              <div
                key={corridor.code}
                className="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-5 py-4 transition-all hover:-translate-y-1 hover:border-blue-400 dark:hover:border-blue-500"
              >
                <div className="flex items-center justify-between text-gray-600 dark:text-gray-300">
                  <span className="text-lg font-semibold text-gray-900 dark:text-white">{corridor.code}</span>
                  <span className="text-xs text-gray-600 dark:text-gray-400">{corridor.currency}</span>
                </div>
                <p className="mt-3 text-sm font-medium text-gray-700 dark:text-gray-200">{corridor.country}</p>
              </div>
            ))}
          </div>
        </section>
      </ScrollRevealContainer>
    </div>
  );
};

export default IntroductionPage;
