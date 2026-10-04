import { useRef, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { Assistant, AssistantModal, type AssistantMessage } from './Assistant';
import { Badge } from './Badge';
import { Button } from './Button';
import { Input } from './Input';
import { Modal } from './Modal';

const ROOM_SUGGESTIONS = [
  { label: '🗂️ Make flashcards', prompt: 'Make flashcards from this week’s materials' },
  { label: '📝 Quiz me', prompt: 'Quiz me on my notes' },
  { label: '🧠 Summarize', prompt: 'Summarize the latest lecture' },
];

const CONVERSATION: AssistantMessage[] = [
  { id: '1', role: 'user', content: 'What’s the difference between precision and recall?' },
  {
    id: '2',
    role: 'assistant',
    content:
      'Precision is the share of the model’s positive predictions that were correct. Recall is the share of actual positives the model found.\n\nYour Week 3 notes use the spam-filter example: high precision means few real emails get flagged; high recall means little spam gets through.',
    sources: [
      { id: 's1', label: 'Week 3 slides', kind: 'material', href: '#' },
      { id: 's2', label: 'My Cornell notes · Week 3', kind: 'note' },
    ],
  },
];

/** Stand-in for the app's RAG call: echoes back a grounded-looking reply after a delay. */
function useMockAssistant(initial: AssistantMessage[] = [], reply = (text: string) => `Here’s what your materials say about “${text}”.`) {
  const [messages, setMessages] = useState(initial);
  const [pending, setPending] = useState(false);
  const nextId = useRef(initial.length + 1);
  const send = (text: string) => {
    const id = () => String(nextId.current++);
    setMessages((m) => [...m, { id: id(), role: 'user', content: text }]);
    setPending(true);
    setTimeout(() => {
      setMessages((m) => [...m, { id: id(), role: 'assistant', content: reply(text), sources: [{ id: 'src', label: 'Lecture 4 slides', kind: 'material' }] }]);
      setPending(false);
    }, 1200);
  };
  return { messages, pending, send };
}

const meta = {
  title: 'Components/Assistant',
  component: Assistant,
  args: { messages: [], onSend: fn(), subtitle: 'MPIM 6750 · Answers from this room', className: 'h-[32rem]' },
  decorators: [(Story) => <div style={{ width: 380 }}><Story /></div>],
} satisfies Meta<typeof Assistant>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The study room's right-hand panel before the student has asked anything. */
export const Embedded: Story = { args: { suggestions: ROOM_SUGGESTIONS, onExpand: fn() } };

/** Replies list the materials and notes they came from, so students can check them. */
export const Conversation: Story = { args: { messages: CONVERSATION, onExpand: fn() } };

export const Pending: Story = { args: { messages: CONVERSATION.slice(0, 1), pending: true } };

export const Failed: Story = {
  args: {
    messages: [
      CONVERSATION[0],
      { id: '2', role: 'assistant', status: 'error', content: 'Something went wrong reaching the assistant. Try sending that again.' },
    ],
  },
};

/** Nothing in the room covers the question, so the assistant says so instead of guessing. */
export const NotInMaterials: Story = {
  args: {
    messages: [
      { id: '1', role: 'user', content: 'Who won the 2026 World Cup?' },
      { id: '2', role: 'assistant', content: 'I couldn’t find that in this room’s materials or notes. Try uploading a source that covers it, or ask about something from the course.' },
    ],
  },
};

/** Type a message: Enter sends, Shift+Enter adds a line. */
export const Interactive: Story = {
  render: function Render(args) {
    const { messages, pending, send } = useMockAssistant();
    return <Assistant {...args} messages={messages} pending={pending} onSend={send} suggestions={messages.length ? undefined : ROOM_SUGGESTIONS} />;
  },
};

/** AssistantModal, open: the same panel in a dialog, with a context strip for what it's helping with. */
export const InModal: Story = {
  parameters: { layout: 'fullscreen', docs: { story: { inline: false, iframeHeight: 640 } } },
  render: (args) => (
    <AssistantModal
      open
      onClose={fn()}
      context="Week 3 · Model evaluation"
      messages={CONVERSATION}
      onSend={args.onSend}
      suggestions={[{ label: '📝 Quiz me on this', prompt: 'Quiz me on precision and recall' }]}
    />
  ),
};

/** The expand button reopens the same thread in an AssistantModal, since the app owns `messages`. */
export const ExpandToModal: Story = {
  render: function Render(args) {
    const { messages, pending, send } = useMockAssistant(CONVERSATION);
    const [open, setOpen] = useState(false);
    return (
      <>
        <Assistant {...args} messages={messages} pending={pending} onSend={send} onExpand={() => setOpen(true)} />
        <AssistantModal open={open} onClose={() => setOpen(false)} size="lg" messages={messages} pending={pending} onSend={send} />
      </>
    );
  },
};

const closeQuiz = fn().mockName('closeQuiz');

const QUESTION = 'What was the key difference between the Plum Pudding Model and the Electron Shell Model in their descriptions of the atom’s structure?';

/** Context-aware help: the ? on a quiz question opens the assistant over the quiz, scoped to that question.
 * Escape closes the assistant first, then the quiz. */
export const QuizHint: Story = {
  decorators: [(Story) => <div style={{ width: 'auto' }}><Story /></div>],
  parameters: { layout: 'fullscreen', docs: { story: { inline: false, iframeHeight: 640 } } },
  render: function Render() {
    const { messages, pending, send } = useMockAssistant([], (text) =>
      text === 'Just a hint'
        ? 'Think about where each model puts the electrons: spread through the atom, or arranged at set distances from the nucleus?'
        : 'In your notes, the Plum Pudding Model has no nucleus at all. Electrons sit inside a spread-out positive charge.',
    );
    const [hintOpen, setHintOpen] = useState(false);
    return (
      <>
        <Modal open onClose={closeQuiz} icon="📝" title="Atom Quiz" size="md" showClose>
          <div className="flex flex-col gap-3 pt-1">
            <p className="rounded-lg bg-kaleiopi-purple-50 px-3 py-2 text-xs text-kaleiopi-purple-700">Just practice — this isn’t graded. Try to answer before you look for hints.</p>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              Question 1 of 10 <Badge>Atomic structure models</Badge>
            </div>
            <p className="text-base font-semibold text-gray-900">{QUESTION}</p>
            <Input aria-label="Your answer" placeholder="Type your answer…" />
            <Button fullWidth>Submit answer</Button>
            <div className="flex items-center justify-between">
              <Button variant="ghost" size="sm" onClick={() => setHintOpen(true)}>💡 Get help</Button>
              <Button>Next</Button>
            </div>
          </div>
        </Modal>
        <AssistantModal
          open={hintOpen}
          onClose={() => setHintOpen(false)}
          title="Help with this question"
          icon="💡"
          context="Question 1 · Atomic structure models"
          greeting="Stuck? Start with a hint."
          greetingHint="Hints come from this room’s materials and your notes, and won’t give the answer away."
          placeholder="Ask about this question…"
          suggestions={[
            { label: 'Just a hint', prompt: 'Just a hint' },
            { label: 'Explain the question', prompt: 'Explain what this question is asking' },
          ]}
          messages={messages}
          pending={pending}
          onSend={send}
        />
      </>
    );
  },
  play: async ({ canvasElement, step }) => {
    closeQuiz.mockClear();
    // Modals portal into document.body, outside the story's canvas.
    const screen = within(canvasElement.ownerDocument.body);
    const getHelp = await screen.findByRole('button', { name: /get help/i });
    let assistant!: HTMLElement;

    await step('Open the assistant from the quiz question', async () => {
      await userEvent.click(getHelp);
      assistant = await screen.findByRole('dialog', { name: 'Help with this question' });
      const panel = within(assistant);
      await expect(panel.getByText('Question 1 · Atomic structure models')).toBeInTheDocument();
      await expect(panel.getByText('Stuck? Start with a hint.')).toBeInTheDocument();
      await waitFor(() => expect(panel.getByRole('textbox', { name: 'Message the assistant' })).toHaveFocus());
    });

    await step('Ask for a hint with a suggestion chip', async () => {
      const panel = within(assistant);
      await userEvent.click(panel.getByRole('button', { name: 'Just a hint' }));
      await expect(panel.getByRole('status')).toHaveTextContent('Checking your materials…');
      await expect(panel.getByRole('button', { name: 'Just a hint' })).toBeDisabled();
      await panel.findByText(/where each model puts the electrons/, {}, { timeout: 3000 });
      await expect(panel.getByText('Lecture 4 slides')).toBeInTheDocument();
      await expect(panel.queryByRole('status')).not.toBeInTheDocument();
    });

    await step('Send a typed follow-up with Enter', async () => {
      const panel = within(assistant);
      const input = panel.getByRole('textbox', { name: 'Message the assistant' });
      await expect(panel.getByRole('button', { name: 'Send' })).toBeDisabled();
      await userEvent.type(input, 'Does the plum pudding model have a nucleus?{Enter}');
      await expect(input).toHaveValue('');
      await expect(panel.getByText('Does the plum pudding model have a nucleus?')).toBeInTheDocument();
      await panel.findByText(/has no nucleus at all/, {}, { timeout: 3000 });
      await expect(panel.getAllByText('Lecture 4 slides')).toHaveLength(2);
    });

    await step('Escape closes only the assistant and returns focus to the quiz', async () => {
      await userEvent.keyboard('{Escape}');
      await waitFor(() => expect(screen.queryByRole('dialog', { name: 'Help with this question' })).not.toBeInTheDocument());
      await expect(screen.getByRole('dialog', { name: 'Atom Quiz' })).toBeInTheDocument();
      await expect(closeQuiz).not.toHaveBeenCalled();
      await expect(getHelp).toHaveFocus();
    });
  },
};
