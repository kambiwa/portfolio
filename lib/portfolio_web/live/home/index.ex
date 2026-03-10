defmodule PortfolioWeb.HomeLive do
  use PortfolioWeb, :live_view

  @impl true
  def mount(_params, _session, socket) do
    skills = [
      %{name: "Backend Development", level: 95},
      %{name: "Payment Integration", level: 98},
      %{name: "USSD Platforms", level: 92},
      %{name: "API Development", level: 96},
      %{name: "Linux Systems", level: 90},
      %{name: "Database Design", level: 94}
    ]

    projects = [
      %{
        id: 1,
        title: "ZRL E-Ticketing System",
        description: "Digital railway ticket purchasing and validation system with real-time booking capabilities.",
        tags: ["Elixir", "Phoenix", "PostgreSQL"],
        icon: "hero-ticket",
        href: "https://zrl.com.zm/"
      },
      %{
        id: 2,
        title: "FRA E-Payment System",
        description: "Electronic payment system for agricultural services and farmer registrations.",
        tags: ["Payment APIs", "Node.js", "MongoDB"],
        icon: "hero-banknotes",
        href: "https://fra.org.zm/"
      },
      %{
        id: 3,
        title: "NFRA E-Toll System",
        description: "Automated toll payment infrastructure with RFID integration and real-time monitoring.",
        tags: ["IoT", "Go", "Redis"],
        icon: "hero-truck",
        href: "https://nrfa.org.zm/"
      },
      %{
        id: 4,
        title: "ZICB USSD Banking",
        description: "Mobile banking services using USSD for feature phones and offline transactions.",
        tags: ["USSD", "Elixir", "MySQL"],
        icon: "hero-device-phone-mobile",
        href: "https://zicb.co.zm/"
      },
      %{
        id: 5,
        title: "Probase Payment Gateway",
        description: "Integration of digital payment infrastructure with multiple processor support.",
        tags: ["APIs", "Python", "AWS"],
        icon: "hero-credit-card",
        href: "https://paymentservices.probasegroup.com/"
      },
      %{
        id: 6,
        title: "EFC Digital Payment System",
        description: "Government digital identity system with biometric integration and secure APIs.",
        tags: ["Security", "Java", "Oracle"],
        icon: "hero-identification",
        href: "https://efczambia.com.zm/"
      }
    ]

    services = [
      %{
        title: "Website Development",
        description: "Custom web applications built with modern frameworks, optimized for performance and security.",
        icon: "hero-globe-alt",
        accent: "primary"
      },
      %{
        title: "Payment Systems Integration",
        description: "Seamless integration of payment gateways, mobile money, and banking APIs for fintech solutions.",
        icon: "hero-credit-card",
        accent: "secondary"
      },
      %{
        title: "API Development",
        description: "RESTful and GraphQL APIs designed for scalability, security, and high-performance data exchange.",
        icon: "hero-cpu-chip",
        accent: "primary"
      },
      %{
        title: "USSD Application Development",
        description: "Feature phone banking solutions and USSD services for financial inclusion in emerging markets.",
        icon: "hero-device-phone-mobile",
        accent: "secondary"
      },
      %{
        title: "Digital Government Platforms",
        description: "E-government solutions including digital ID, tax systems, and citizen service portals.",
        icon: "hero-building-library",
        accent: "primary"
      },
      %{
        title: "System Security Audit",
        description: "Comprehensive security assessments and hardening for financial and government systems.",
        icon: "hero-shield-check",
        accent: "secondary"
      }
    ]

    stats = [
      %{value: "78+", label: "Projects"},
      %{value: "95%", label: "Client Satisfaction"},
      %{value: "3+", label: "Years Experience"},
      %{value: "30+", label: "Enterprise Clients"}
    ]

    tech_stack = ["Elixir", "Phoenix", "APIs", "USSD", "Payment Gateways", "Linux", "Databases"]

    {:ok,
     socket
     |> assign(:page_title, "Home")
     |> assign(:current_year, Date.utc_today().year)
     |> assign(:current_scope, "home")
     |> assign(:mobile_menu_open, false)
     |> assign(:skills, skills)
     |> assign(:projects, projects)
     |> assign(:services, services)
     |> assign(:stats, stats)
     |> assign(:tech_stack, tech_stack)
     |> assign(:form_name, "")
     |> assign(:form_email, "")
     |> assign(:form_subject, "")
     |> assign(:form_message, "")
     |> assign(:form_sent, false)}
  end

  @impl true
  def handle_event("submit_contact", %{"name" => name, "email" => email, "subject" => subject, "message" => message}, socket) do
    # Here you would send the email / save to DB
    IO.puts("Contact from #{name} <#{email}>: #{subject} — #{message}")
    {:noreply, assign(socket, :form_sent, true)}
  end

  @impl true
  def handle_event("reset_form", _params, socket) do
    {:noreply,
     socket
     |> assign(:form_sent, false)
     |> assign(:form_name, "")
     |> assign(:form_email, "")
     |> assign(:form_subject, "")
     |> assign(:form_message, "")}
  end
end
