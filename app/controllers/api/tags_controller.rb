class Api::TagsController < ApplicationController
  protect_from_forgery
  skip_before_action :verify_authenticity_token

  def index
    @tag = Tag.new
    @tags = @tag.process
    @tasks = Task.all
  end

  def create
    @tag = Tag.new(tag_params)
    begin
      @tag.save!
      render '/api/tags/create'
    rescue ActiveRecord::RecordInvalid => exception
      render json: { errors: @tag.errors.keys.map { |key| [key, @tag.errors.full_messages_for(key)]}.to_h, render: 'index.json.jbuilder' }, status: :unprocessable_entity
    end
  end

  def update
    @tag = Tag.find(params[:tag_id])
    begin
      @tag.update(status: params[:status])
    rescue => exception
      puts exception
    end
  end

  def destroy
    begin
      TagTaskConnection.where(tag_id: params[:id]).each do |connection|
        Task.find(connection[:task_id]).destroy
      end
      begin
        Tag.find(params[:id]).destroy
        puts 'hi'
      rescue => exception
        puts exception
      end
    rescue => exception
      puts exception
    end
  end

  def create_task
    @task = Task.new(task_params)
    begin
      @task.save!
      @tag_task_connection = TagTaskConnection.new(connection_params)
      render '/api/tags/create_task'
      begin
        @tag_task_connection.save!
      rescue => exception
        render json: { errors: @tag_task_connection.errors.keys.map { |key| [key, @tag_task_connection.errors.full_messages_for(key)]}.to_h, render: 'index.json.jbuilder' }, status: :unprocessable_entity
      end
    rescue ActiveRecord::RecordInvalid => exception
      render json: { errors: @task.errors.keys.map { |key| [key, @task.errors.full_messages_for(key)]}.to_h, render: 'index.json.jbuilder' }, status: :unprocessable_entity
    end
  end

  def clear_tasks
    params[:tasks].each do |task_id|
      begin
        Task.find(task_id).destroy
      rescue => exception
        puts exception
      end
    end
  end

  private

  def tag_params
    # <ActionController::Parameters {"title"=>"param確認テスト", "status"=>0} permitted: true>
    params.require(:tag).permit("title", "status")
  end

  def task_params
    params.require(:task).permit("text", "deadline", "priority")
  end

  def connection_params
    params[:tag_task_connection]["task_id"] = Task.last[:id]
    params.require(:tag_task_connection).permit("tag_id", "task_id")
  end

end