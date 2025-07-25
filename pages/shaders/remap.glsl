/**
    将一个数值从一个范围映射到另一个范围。
    @param value 输入值
    @param originMin 输入范围最小值
    @param originMax 输入范围最大值
    @param destinationMin 输出范围最小值
    @param destinationMax 输出范围最大值
    @return 映射后的值 其位于目标范围 [destinationMin, destinationMax] 内

    原理：
    1.把输入值value从原来的范围[originMin, originMax]转换到[0, 1]这个区间。
    2.再将归一化后的值映射到目标范围[destinationMin, destinationMax]。
    
*/
float remap(float value, float originMin, float originMax, float destinationMin, float destinationMax) {
    return destinationMin + (value - originMin) * (destinationMax - destinationMin) / (originMax - originMin);
}