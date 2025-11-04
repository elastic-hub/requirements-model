export default defineAppConfig({
  ui: {
    primary: "neutral",
  },

  // googleDrive, gitHub & links are the only supported platforms for now
  dynamic_table: {
    topic: {
      platform: {
        'Google Drive': 'googleDrive', //key can be changeable but value should be either googleDrive, gitHub or links
        'FOCUS_Spec': 'gitHub',
        'foundation': 'gitHub',
        default: 'links'
      },
    },
    fetch: {
      dataUrl: {
        includes: ['github', 'raw.githubusercontent'], // this is used to check if the url includes any of these strings in order to use the credentials
      }
    }
  },

  gen_ai: {
    radioGroup: [
      { value: 'Markdown', label: '', iconTooltip:'Markdown', icon: 'i-ph:markdown-logo-light' },
      { value: 'PDF', label: '', iconTooltip: 'PDF', icon: 'i-teenyicons:pdf-outline' },
      { value: 'Open Word', label: '', iconTooltip: 'Open Word', icon: 'i-fa:file-word-o' },
      { value: 'PowerPoint', label: '', iconTooltip: 'PowerPoint', icon: 'i-file-icons:microsoft-powerpoint' }
    ],
    selected: 0, // This is used to set the default selected value in the radio group. The labels starts from 0.
    color: "white", // allowed values: "red", "green", "orange", "amber", "yellow", "lime", "emerald", "teal", "cyan", "sky", "blue", "indigo", "violet", "purple", "fuchsia", "pink", "rose", "primary"
    selectQuestionLabel: 'Question',
    selectIDLabel: 'Select ID',
    alert: {
      message: '',
    },
    button: {
      color: 'green',
      label: '',
      icon: '',
      rounded: 'lg',
      size: 'xl', // allowed values: "xs", "sm", "md", "lg", "xl"
    },
  },

  likes: {
    question: '',
    icon: {
      upvote: 'pepicons-pencil:thumbs-up-circle-filled',
      downvote: 'pepicons-pencil:thumbs-down-circle-filled',
    },
  },

  site: {
    image: {
      logo: '', // This has NO precedance over header || footer image logo. Used for ease of access or as fallback
    },
    brand: {
      name: {
        value: '', // This has NO precedance over header || footer brand name. Used for ease of access or as fallback
        font: {
          type: '',
          size: ''
        }
      }
    },
    error: {
      403: '',
      404: '',
      500: '',
    }
  },
  header: {
    image: {
      logo: 'img/focus_logo.svg',
    },
    brand: {
      name: {
        value: '',
        font: {
          type: '',
          size: ''
        }
      },
      tagline: {
        value: '',
        font: {
          type: '',
          size: ''
        }
      },
    },
    menu: {
      font: {
        type: 'Arial, sans-serif',
        size: '22px',
      }
    }
  },
  main: {
    font: {
      type: 'Arial',
      size: '20px',
    },
    h1: {
      font: {
        type: 'DM Sans',
        size: '2em',
      },
    },
    h2: {
      font: {
        type: 'DM Sans',
        size: '1.5em',
      },
    },
    h3: {
      font: {
        type: 'DM Sans',
        size: '1.17em',
      },
    },
    h4: {
      font: {
        type: 'DM Sans',
        size: '1em',
      },
    },
    h5: {
      font: {
        type: 'DM Sans',
        size: '0.83em',
      },
    },
    h6: {
      font: {
        type: 'DM Sans',
        size: '0.67em',
      },
    },
    h7: {
      font: {
        type: 'DM Sans',
        size: '0.44em',
      },
    },
  },
  footer: {
    image: {
      logo: 'img/focus_logo_notext.svg',
      background: '',
    },
    brand: {
      name: {
        value: '',
        font: {
          type: '',
          size: ''
        }
      },
      tagline: {
        value: '', //Simplify. Collaborate. Innovate
        font: {
          type: '',
          size: ''
        }
      },
    },
    content: {
      font: {
        type: '',
        size: '14px'
      }
    }
  },
  hamburgerMenu: {
    footer: {
      brand: {
        name: {
          value: 'FinOps Open Cost and Usage Specification',
          font: {
            type: '',
            size: ''
          }
        },
        tagline: {
          value: '',
          font: {
            type: '',
            size: ''
          }
        },
      }
    }
  },
  menus: {
    menu_order: [],
    routes: {
      ignore: [],
      titles: {
        ignore: [], //in a md file use in frontmatter (navigation: false) without () to get the same effect
      }
    },
  },
  socialLinks: {
    linkedIn: {
      title: "LinkedIn",
      logo: "i-fa6-brands-linkedin",
      url: "https://www.linkedin.com/company/finops-foundation/",
    },
    youtube: {
      title: "YouTube",
      logo: "i-fa6-brands-square-youtube",
      url: "https://www.youtube.com/channel/UCyl26lvnoySlGWlF5oNHvYA",
    },
    github: {
      title: "GitHub",
      logo: "i-fa6-brands-square-github",
      url: "https://github.com/finopsfoundation",
    },
  },
  usefulLinks: {
    heading: "Useful Links",
    linkedIn: {
      title: "LinkedIn",
      url: "https://www.linkedin.com/company/finops-foundation/",
      icon: "i-fa6-brands-linkedin"
    },
    youtube: {
      title: "YouTube",
      url: "https://www.youtube.com/channel/UCyl26lvnoySlGWlF5oNHvYA",
      icon: "i-fa6-brands-square-youtube"
    },
    github: {
      title: "GitHub",
      url: "https://github.com/finopsfoundation",
      icon: "i-fa6-brands-square-github"
    }
  }
});
