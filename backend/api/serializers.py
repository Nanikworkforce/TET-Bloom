from rest_framework import serializers
from .models.teachers import Teacher
from .models.observation_groups import ObservationGroup
from .models.schedule import Schedule
from .models.administrators import Administrator
from .models.user import Users

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = Users
        fields = ['id', 'name', 'email', 'role', 'status', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

class TeacherSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Teacher
        fields = ['id', 'user','subject', 'grade', 'years_of_experience']

    def create(self, validated_data):
        # Get the user instance from the user_id
        user_id = self.context['request'].data.get('user')
        if user_id:
            try:
                user = Users.objects.get(id=user_id)
                validated_data['user'] = user
            except Users.DoesNotExist:
                raise serializers.ValidationError(f"User with id {user_id} does not exist")
        
        teacher = Teacher.objects.create(**validated_data)
        return teacher

    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance

class ObservationGroupSerializer(serializers.ModelSerializer):
    teachers = TeacherSerializer(many=True, read_only=True)
    created_by = UserSerializer(read_only=True)

    class Meta:
        model = ObservationGroup
        fields = ['id', 'name', 'note', 'created_by', 'teachers', 'status', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

    def create(self, validated_data):
        # Get teacher IDs and created_by from the request
        teacher_ids = self.context['request'].data.get('teachers', [])
        created_by_id = self.context['request'].data.get('created_by')
        
        # Set the created_by field
        if created_by_id:
            try:
                created_by_user = Users.objects.get(id=created_by_id)
                validated_data['created_by'] = created_by_user
            except Users.DoesNotExist:
                raise serializers.ValidationError(f"User with id {created_by_id} does not exist")
        
        # Create the observation group
        observation_group = ObservationGroup.objects.create(**validated_data)
        
        # Add teachers to the group
        if teacher_ids:
            teachers = Teacher.objects.filter(id__in=teacher_ids)
            observation_group.teachers.set(teachers)
        
        return observation_group

    def update(self, instance, validated_data):
        # Get teacher IDs from the request
        teacher_ids = self.context['request'].data.get('teachers', [])
        
        # Update the observation group
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        # Update teachers if provided
        if teacher_ids is not None:
            teachers = Teacher.objects.filter(id__in=teacher_ids)
            instance.teachers.set(teachers)
        
        return instance

class ScheduleSerializer(serializers.ModelSerializer):
    teacher = TeacherSerializer(read_only=True)
    observation_group = ObservationGroupSerializer(read_only=True)
    
    class Meta:
        model = Schedule
        fields = ['id', 'observation_group', 'teacher', 'date', 'time', 'observation_type', 'notes', 'status', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

    def create(self, validated_data):
        # Get teacher_id and observation_group_id from the request
        teacher_id = self.context['request'].data.get('teacher')
        observation_group_id = self.context['request'].data.get('observation_group')
        
        # Set the teacher field
        if teacher_id:
            try:
                teacher = Teacher.objects.get(id=teacher_id)
                validated_data['teacher'] = teacher
            except Teacher.DoesNotExist:
                raise serializers.ValidationError(f"Teacher with id {teacher_id} does not exist")
        
        # Set the observation_group field
        if observation_group_id:
            try:
                observation_group = ObservationGroup.objects.get(id=observation_group_id)
                validated_data['observation_group'] = observation_group
            except ObservationGroup.DoesNotExist:
                raise serializers.ValidationError(f"Observation group with id {observation_group_id} does not exist")
        
        schedule = Schedule.objects.create(**validated_data)
        return schedule

    def update(self, instance, validated_data):
        # Get teacher_id and observation_group_id from the request
        teacher_id = self.context['request'].data.get('teacher')
        observation_group_id = self.context['request'].data.get('observation_group')
        
        # Update the schedule
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        # Update teacher if provided
        if teacher_id is not None:
            if teacher_id:
                try:
                    teacher = Teacher.objects.get(id=teacher_id)
                    instance.teacher = teacher
                except Teacher.DoesNotExist:
                    raise serializers.ValidationError(f"Teacher with id {teacher_id} does not exist")
            else:
                instance.teacher = None
        
        # Update observation_group if provided
        if observation_group_id is not None:
            if observation_group_id:
                try:
                    observation_group = ObservationGroup.objects.get(id=observation_group_id)
                    instance.observation_group = observation_group
                except ObservationGroup.DoesNotExist:
                    raise serializers.ValidationError(f"Observation group with id {observation_group_id} does not exist")
            else:
                instance.observation_group = None
        
        instance.save()
        return instance

class AdministratorSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Administrator
        fields = ['id', 'user']

    def create(self, validated_data):
        # Get the user instance from the user_id
        user_id = self.context['request'].data.get('user')
        if user_id:
            try:
                user = Users.objects.get(id=user_id)
                validated_data['user'] = user
            except Users.DoesNotExist:
                raise serializers.ValidationError(f"User with id {user_id} does not exist")
        
        administrator = Administrator.objects.create(**validated_data)
        return administrator

    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance
