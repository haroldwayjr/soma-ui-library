import type { ReactNode } from 'react'
import {
  Avatar,
  Badge,
  Button,
  Card,
  Checkbox,
  Chip,
  Link,
  Pagination,
  Progress,
  Radio,
  RadioGroup,
  Select,
  Stack,
  Switch,
  TextField,
  Tooltip,
  Typography,
} from '@nova/ui'
import type { RegistryComponent } from '../lib/registry'

export interface LiveGroup {
  label: string
  example: ReactNode
  code: string
}

const row = (children: ReactNode) => (
  <Stack gap={12} horizontal align="center" wrap>
    {children}
  </Stack>
)

export function getLiveGroups(component: RegistryComponent): LiveGroup[] | null {
  if (component.implementationStatus === 'not-implemented') return null
  const name = component.name.toLowerCase()

  if (name === 'switch' || name.includes('switch /')) {
    return [
      {
        label: 'Default',
        example: row(
          <>
            <Switch aria-label="Notifications" />
            <Switch aria-label="Updates" defaultChecked />
          </>,
        ),
        code: '<Switch aria-label="Notifications" />',
      },
      {
        label: 'Disabled',
        example: row(
          <>
            <Switch aria-label="Disabled" disabled />
            <Switch aria-label="Disabled checked" disabled defaultChecked />
          </>,
        ),
        code: '<Switch aria-label="Disabled" disabled />',
      },
    ]
  }

  if (name.includes('checkbox')) {
    return [
      {
        label: 'Default',
        example: row(
          <>
            <Checkbox aria-label="Select item" />
            <Checkbox aria-label="Selected item" defaultChecked />
            <Checkbox aria-label="Partially selected" indeterminate />
          </>,
        ),
        code: '<Checkbox aria-label="Select item" />',
      },
      {
        label: 'Disabled',
        example: row(
          <>
            <Checkbox aria-label="Disabled" disabled />
            <Checkbox aria-label="Disabled selected" disabled defaultChecked />
          </>,
        ),
        code: '<Checkbox aria-label="Disabled" disabled />',
      },
    ]
  }

  if (name.includes('radio')) {
    return [
      {
        label: 'Default',
        example: (
          <RadioGroup
            aria-label="Options"
            defaultValue="one"
            name="options"
            className="flex gap-4"
          >
            <label className="flex items-center gap-2 text-sm">
              <Radio value="one" />
              One
            </label>
            <label className="flex items-center gap-2 text-sm">
              <Radio value="two" />
              Two
            </label>
          </RadioGroup>
        ),
        code: `<RadioGroup aria-label="Options" name="options">
  <Radio value="one" />
  <Radio value="two" />
</RadioGroup>`,
      },
    ]
  }

  if (name === 'badge' || name.includes('badge /')) {
    const tones = [
      'neutral',
      'brand',
      'accent',
      'success',
      'warning',
      'danger',
    ] as const
    const toneLabel = {
      neutral: 'Neutral',
      brand: 'Brand',
      accent: 'Accent',
      success: 'Success',
      warning: 'Warning',
      danger: 'Danger',
    } as const

    return [
      {
        label: 'Variations',
        example: (
          <Stack gap={12}>
            {tones.map((tone) => (
              <Stack key={tone} gap={12} horizontal align="center" wrap>
                <Badge size="medium" tone={tone} variant="soft">
                  Label
                </Badge>
                <Badge size="medium" tone={tone} variant="soft" leading="icon">
                  {toneLabel[tone]}
                </Badge>
                <Badge size="medium" tone={tone} variant="soft" leading="dot">
                  Label
                </Badge>
              </Stack>
            ))}
          </Stack>
        ),
        code: [
          '<Badge size="medium" tone="brand" variant="soft">Label</Badge>',
          '<Badge size="medium" tone="brand" variant="soft" leading="icon">Brand</Badge>',
          '<Badge size="medium" tone="brand" variant="soft" leading="dot">Label</Badge>',
        ].join('\n'),
      },
      {
        label: 'Disabled',
        example: (
          <Badge size="medium" tone="brand" variant="soft" disabled>
            Disabled
          </Badge>
        ),
        code: '<Badge size="medium" tone="brand" variant="soft" disabled>Disabled</Badge>',
      },
    ]
  }

  if (name.includes('button') && !name.includes('icon') && !name.includes('avatar')) {
    return [
      {
        label: 'Variant',
        example: row(
          <>
            <Button size="medium" tone="brand" variant="contained">
              Contained
            </Button>
            <Button size="medium" tone="brand" variant="outlined">
              Outlined
            </Button>
            <Button size="medium" tone="brand" variant="text">
              Text
            </Button>
          </>,
        ),
        code: '<Button size="medium" tone="brand" variant="contained">Continue</Button>',
      },
      {
        label: 'Disabled',
        example: (
          <Button size="medium" tone="brand" variant="contained" disabled>
            Continue
          </Button>
        ),
        code: '<Button size="medium" tone="brand" variant="contained" disabled>Continue</Button>',
      },
    ]
  }

  if (name.includes('chip')) {
    return [
      {
        label: 'Variant',
        example: row(
          <>
            <Chip variant="filled">Filled</Chip>
            <Chip variant="outlined">Outlined</Chip>
          </>,
        ),
        code: '<Chip variant="filled">Label</Chip>',
      },
    ]
  }

  if (name === 'link' || name.includes('text link') || name === 'back link') {
    return [
      {
        label: 'Default',
        example: <Link href="/ui-library">View documentation</Link>,
        code: '<Link href="/docs">View documentation</Link>',
      },
    ]
  }

  if (name.includes('progress')) {
    return [
      {
        label: 'Value',
        example: (
          <div className="w-full max-w-sm">
            <Progress size="medium" layout="labeled" value={64}>
              Upload progress
            </Progress>
          </div>
        ),
        code: '<Progress size="medium" layout="labeled" value={64}>Upload progress</Progress>',
      },
    ]
  }

  if (
    name.includes('avatar') &&
    !name.includes('photo') &&
    !name.includes('group') &&
    !name.includes('presence')
  ) {
    return [
      {
        label: 'Size',
        example: row(
          <>
            <Avatar size="sm" initials="SM" />
            <Avatar size="md" initials="MD" />
            <Avatar size="lg" initials="LG" />
          </>,
        ),
        code: '<Avatar size="md" initials="MD" />',
      },
      {
        label: 'Presence',
        example: <Avatar size="lg" initials="AJ" presence="online" />,
        code: '<Avatar size="lg" initials="AJ" presence="online" />',
      },
    ]
  }

  if (name.includes('presence')) {
    return [
      {
        label: 'Status',
        example: row(
          <>
            <Avatar size="md" initials="ON" presence="online" />
            <Avatar size="md" initials="OF" presence="offline" />
            <Avatar size="md" initials="BY" presence="busy" />
          </>,
        ),
        code: '<Avatar size="md" initials="ON" presence="online" />',
      },
    ]
  }

  if (name === 'pagination') {
    return [
      {
        label: 'Middle',
        example: (
          <Pagination page={5} pageCount={12} onPageChange={() => undefined} />
        ),
        code: '<Pagination page={5} pageCount={12} onPageChange={setPage} />',
      },
    ]
  }

  if (name === 'card' || name.includes('card /')) {
    return [
      {
        label: 'Default',
        example: (
          <Card.Root className="w-full max-w-sm">
            <Card.Header>
              <Card.HeaderTitle>Care plan</Card.HeaderTitle>
            </Card.Header>
            <Card.Body>
              <Typography variant="body2">
                Review goals and next steps for this member.
              </Typography>
            </Card.Body>
          </Card.Root>
        ),
        code: `<Card.Root>
  <Card.Header><Card.HeaderTitle>Care plan</Card.HeaderTitle></Card.Header>
  <Card.Body>…</Card.Body>
</Card.Root>`,
      },
    ]
  }

  if (
    name === 'field' ||
    name === 'text field' ||
    name === 'text input' ||
    name.includes('password input') ||
    name.includes('search input') ||
    name.includes('input / email') ||
    name.includes('input / phone') ||
    name.includes('input / website')
  ) {
    return [
      {
        label: 'Default',
        example: (
          <div className="w-full max-w-sm">
            <TextField
              label="Email"
              name="email"
              type="email"
              description="Work address preferred"
            />
          </div>
        ),
        code: '<TextField label="Email" name="email" type="email" />',
      },
      {
        label: 'Error',
        example: (
          <div className="w-full max-w-sm">
            <TextField
              label="Email"
              name="email-error"
              type="email"
              error="Enter a valid email"
            />
          </div>
        ),
        code: '<TextField label="Email" name="email" error="Enter a valid email" />',
      },
    ]
  }

  if (name.includes('select')) {
    return [
      {
        label: 'Default',
        example: (
          <div className="w-full max-w-sm">
            <Select
              aria-label="Priority"
              items={[
                { label: 'Low', value: 'low' },
                { label: 'Medium', value: 'medium' },
                { label: 'High', value: 'high' },
              ]}
              placeholder="Select priority"
            />
          </div>
        ),
        code: `<Select
  aria-label="Priority"
  items={[{ label: 'Low', value: 'low' }, { label: 'High', value: 'high' }]}
  placeholder="Select priority"
/>`,
      },
    ]
  }

  if (name === 'tooltip') {
    return [
      {
        label: 'Default',
        example: (
          <Tooltip content="More detail about this control">
            <Button size="medium" tone="brand" variant="outlined">
              Hover me
            </Button>
          </Tooltip>
        ),
        code: '<Tooltip content="More detail"><Button>Hover me</Button></Tooltip>',
      },
    ]
  }

  if (name === 'stack') {
    return [
      {
        label: 'Horizontal',
        example: (
          <Stack gap={12} horizontal>
            <span>One</span>
            <span>Two</span>
            <span>Three</span>
          </Stack>
        ),
        code: '<Stack gap={12} horizontal>…</Stack>',
      },
    ]
  }

  if (name.includes('typography')) {
    return [
      {
        label: 'Hierarchy',
        example: (
          <Stack gap={8}>
            <Typography variant="h3">Heading</Typography>
            <Typography variant="body1">
              Body copy uses the shared type scale.
            </Typography>
          </Stack>
        ),
        code: '<Typography variant="h3">Heading</Typography>',
      },
    ]
  }

  return null
}
