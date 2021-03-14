import React, { useState, useEffect } from "react";

import { View } from "react-native";

import { useTasks } from "../providers/TasksProvider";
import { TaskItem } from "../components/TaskItem";
import { Logout } from "../components/Logout";
import { AddTask } from "../components/AddTask";
import styles from "../stylesheet";

export function TasksView({ navigation }) {
  const { tasks, createTask } = useTasks();
  useEffect(() => {
    navigation.setOptions({
      headerRight: function Header() {
        return <Logout />;
      },
      title: `My Tasks`,
    });
  }, []);

  return (
    <View style={styles.alignCenter}>
      <View style={styles.plusButtonWrapper}>
        <AddTask createTask={createTask} />
      </View>
      {tasks.map((task) =>
        task ? <TaskItem key={`${task._id}`} task={task} /> : null
      )}
    </View>
  );
}
