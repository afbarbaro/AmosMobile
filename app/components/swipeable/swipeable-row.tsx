import { Ionicons } from "@expo/vector-icons"
import React, { FC, memo, useRef } from "react"
import { Animated, I18nManager, StyleSheet } from "react-native"
import { RectButton, Swipeable } from "react-native-gesture-handler"
import { palette } from "../../theme"

const AnimatedIcon = Ionicons

type SwipableRowProps = {
  leftActionIcon?: "add-circle"
  rightActionIcon?: "trash-bin"
  leftAction?: () => void
  rightAction?: () => void
}

export const SwipeableRow: FC<SwipableRowProps> = memo(
  ({ leftActionIcon, rightActionIcon, leftAction, rightAction, children }) => {
    const ref = useRef<Swipeable>(null)

    const renderLeftActions = (
      _progress: Animated.AnimatedInterpolation,
      _dragX: Animated.AnimatedInterpolation,
    ) => {
      return leftActionIcon ? (
        <RectButton style={styles.leftAction}>
          <AnimatedIcon name={leftActionIcon} size={30} color="#fff" style={styles.actionIcon} />
        </RectButton>
      ) : null
    }

    const renderRightActions = (
      _progress: Animated.AnimatedInterpolation,
      _dragX: Animated.AnimatedInterpolation,
    ) => {
      return rightActionIcon ? (
        <RectButton style={styles.rightAction}>
          <AnimatedIcon name={rightActionIcon} size={30} color="#fff" style={styles.actionIcon} />
        </RectButton>
      ) : null
    }

    const onSwipeableLeftOpen = () => {
      ref.current?.close()
      leftAction?.()
    }
    const onSwipeableRightOpen = () => {
      ref.current?.close()
      rightAction?.()
    }

    return (
      <Swipeable
        ref={ref}
        onSwipeableLeftOpen={onSwipeableLeftOpen}
        onSwipeableRightOpen={onSwipeableRightOpen}
        friction={2}
        leftThreshold={80}
        rightThreshold={41}
        renderLeftActions={renderLeftActions}
        renderRightActions={renderRightActions}
      >
        {children}
      </Swipeable>
    )
  },
)

const styles = StyleSheet.create({
  actionIcon: {
    marginHorizontal: 10,
    width: 30,
  },
  leftAction: {
    alignItems: "center",
    backgroundColor: palette.emerald[700],
    flex: 1,
    flexDirection: I18nManager.isRTL ? "row" : "row-reverse",
    justifyContent: "flex-end",
  },
  rightAction: {
    alignItems: "center",
    backgroundColor: palette.red[700],
    flexDirection: I18nManager.isRTL ? "row-reverse" : "row",
    flex: 1,
    justifyContent: "flex-end",
  },
})
