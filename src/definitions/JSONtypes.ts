type Links = {
  text: string
  URL: string
  download?: string
}

type Software = {
  name: string
  icon: string
}

type ProjectSection = {
  title: string
  reference: {
    url: string
    alt: string
    code: string | null
  }
  description: string
}

type ProjectDescription = {
  title: string
  sections: ProjectSection[]
  conclusion: string
}

interface Project {
  title: string
  description: string
  route: string
  previewURL: string
  tags: string[]
  year: number
  client: {
    name: string
    description: string
  }
  objective: string
  links: Links[]
  software: Software[]
  outcome: string
  project: ProjectDescription
}

export { type Project }
