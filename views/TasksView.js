import React, { useState, useEffect } from "react";

import { View } from "react-native";

import { useTasks } from "../providers/TasksProvider";
import { TaskItem } from "../components/TaskItem";
import { AddTask } from "../components/AddTask";
import styles from "../stylesheet";

export function TasksView({ navigation }) {
  const { tasks, createTask } = useTasks();
  useEffect(() => {
    navigation.setOptions({
      headerRight: function Header() {
        return <AddTask createTask={createTask} />;
      },
      title: `My Tasks`,
    });
  }, []);

  return (
    <View style={styles.alignCenter}>
      {tasks.map((task) =>
        task ? <TaskItem key={`${task._id}`} task={task} /> : null
      )}
    </View>
  );
}
