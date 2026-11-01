'use client';

import { Box, Button, Group, Text, Title } from "@mantine/core";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

const log = (msg: string) => console.log(`${(performance.now() / 1000).toFixed(2)}s ${msg}`);

interface CustomMessage {
	title: string,
	fail: boolean,
	hang?: boolean
}

interface PanelProps {
	onHide: () => void;
}

const MutationPanel = ({onHide}: PanelProps) => {
	const mut = useMutation({
		mutationFn: async (v: CustomMessage) => {
			log("3. mutationFn работаем с " + v.title);
			await new Promise(r => setTimeout(r, 1000));
			if (v.fail)
				throw new Error("бомба");
			if (v.hang)
				return new Promise(() => {});
			return {
				id: 1,
				title: v.title
			}
		},
		onMutate: () => {
			log("2. onMutate опции");
			return {
				snapshot: "ctx"
			};
		},
		onSuccess: () => log("4. onSuccess опции"),
		onError: () => log("4. onError опции"),
		onSettled: () => log("5. onSettled опции"),
		retry: 2,
		retryDelay: 500,
		scope: {
			id: "demo"
		}
	});

	const onSend = (fail: boolean) => mut.mutate({
		title: "hello worl",
		fail
	}, {
		onSuccess: () => log("6. onSuccess percall"),
		onError: () => log("6. onError percall"),
		onSettled: () => log("7. onSettled percall")
	});

	const onSendHide = () => {
		onSend(false);
		setTimeout(onHide, 200);
	}

	const onSendTwo = (hang: boolean) => {
		mut.mutate({
			title: "первый",
			fail: false,
			hang
		});
		mut.mutate({
			title: "второй",
			fail: false
		});
	}

	return (
		<Box p={60}>
			<Group gap="md">
				<Button color="green" onClick={() => onSend(false)}>Отправить без провалов</Button>
				<Button color="red" onClick={() => onSend(true)}>Отправить провал</Button>
			</Group>
			<Group gap="md" mt="md">
				<Button color="pink" onClick={onSendHide}>Отправить со скрытием</Button>
				<Button color="orange" onClick={() => onSendTwo(false)}>Отправить 2 мутации</Button>
				<Button color="red" onClick={() => onSendTwo(true)}>Отправить 2 мутации с тормозом</Button>
			</Group>
			<Title order={4}>Статус: {mut.status}</Title>
			<Title order={4}>isPaused: {mut.isPaused}</Title>
			<Text c="red" fw={700} size="lg">JSON данные: {JSON.stringify(mut.data)}</Text>
			<Text c="blue" fw={700} size="xl">Счетчик провалов (failureCount) = {mut.failureCount}</Text>
		</Box>
	);
}

export default function Home() {
	const [show, setShow] = useState(true);
	return (
		<Box p={20}>
			<Button onClick={() => setShow(x => !x)}>
				{show ? "Скрыть" : "Показать"}
			</Button>
			{show && (
				<MutationPanel onHide={() => setShow(false)}></MutationPanel>
			)}
		</Box>
	)
}